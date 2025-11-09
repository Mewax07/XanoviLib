import { cbc } from "@noble/ciphers/aes.js";
import { utf8ToBytes } from "@noble/ciphers/utils.js";
import { md5 } from "@noble/hashes/legacy.js";
import { PublicKey } from "micro-rsa-dsa-dh/rsa.js";
import { AsyncQueue } from "~_maq/index";
import { defaultValue, deserializeWith, rename, t } from "~d0/index";
import { InstanceInformation } from "./instance";
import { Parameters } from "./params";
import { Version } from "./version";
import { Webspace } from "./webspace";

export class Session {
	public readonly rsa: SessionRSA;
	public readonly aes: SessionAES;
	public readonly api: SessionAPI;

	public parameters: Parameters;

	/** @internal */
	public constructor(
		public readonly instance: InstanceInformation,
		public readonly homepage: HomepageSession,
		public readonly url: string,
		parameters: Parameters,
	) {
		this.parameters = parameters;
		this.rsa = new SessionRSA(homepage);
		this.aes = new SessionAES();
		this.api = new SessionAPI(homepage, instance.version);
	}

	public setParams(params: Parameters) {
		this.parameters = params;
	}
}

export class SessionRSA {
	private static DEFAULT_RSA_MODULUS =
		130337874517286041778445012253514395801341480334668979416920989365464528904618150245388048105865059387076357492684573172203245221386376405947824377827224846860699130638566643129067735803555082190977267155957271492183684665050351182476506458843580431717209261903043895605014125081521285387341454154194253026277n;
	private static DEFAULT_RSA_EXPONENT = 65537n;

	private modulus = SessionRSA.DEFAULT_RSA_MODULUS;
	private exponent = SessionRSA.DEFAULT_RSA_EXPONENT;

	/**
	 * Whether the modulus and exponent are coming from
	 * the webspace HTML homepage or not.
	 */
	public readonly custom: boolean;

	public get publicKey(): PublicKey {
		return {
			n: this.modulus,
			e: this.exponent,
		};
	}

	/** @internal */
	public constructor(session: HomepageSession) {
		if (session.rsaModulus) this.modulus = BigInt("0x" + session.rsaModulus);
		if (session.rsaExponent) this.exponent = BigInt("0x" + session.rsaExponent);

		this.custom = !!session.rsaExponent && !!session.rsaModulus;
	}
}

export class SessionAES {
	public iv: Uint8Array<ArrayBufferLike> = new Uint8Array(16);
	public key: Uint8Array<ArrayBufferLike> = new Uint8Array();

	private get _mKey(): Uint8Array {
		return md5(this.key);
	}

	private get _mIv(): Uint8Array {
		if (this.iv.every((byte) => byte === 0x00)) {
			return this.iv;
		}

		return md5(this.iv);
	}

	public encrypt(input: Uint8Array | string | number): Uint8Array {
		if (typeof input === "number") input = String(input);
		if (typeof input === "string") input = utf8ToBytes(input);
		return cbc(this._mKey, this._mIv).encrypt(input);
	}

	public decrypt(bytes: Uint8Array): Uint8Array {
		return cbc(this._mKey, this._mIv).decrypt(bytes);
	}
}

interface Properties {
	data: string;
	requestId: string;
	signature: string;
	orderNumber: string;
	secureData: string;
	session: string;

	fileUploadOrderNumber: string;
	fileUploadSession: string;
	fileUploadRequestId: string;
	fileUploadFileId: string;
	fileUploadMd5: string;
}

export class SessionAPI {
	public order = 0;
	public queue = new AsyncQueue();

	public skipEncryption: boolean;
	public skipCompression: boolean;

	public properties: Properties;

	/** @internal */
	public constructor(session: HomepageSession, version: Version) {
		if (Version.isGreaterThanOrEqualTo202513(version)) {
			this.skipEncryption = !session.enforceEncryption;
			this.skipCompression = !session.enforceCompression;
		} else {
			this.skipEncryption = session.skipEncryption;
			this.skipCompression = session.skipCompression;
		}

		if (Version.isGreaterThanOrEqualTo202513(version)) {
			this.properties = {
				data: "data",
				orderNumber: "no",
				secureData: "dataSec",
				requestId: "id",
				signature: "Signature",
				session: "session",

				fileUploadOrderNumber: "u_no",
				fileUploadSession: "u_ns",
				fileUploadRequestId: "u_idR",
				fileUploadFileId: "u_idF",
				fileUploadMd5: "u_md5",
			};
		} else {
			let common = {
				orderNumber: "numeroOrdre",
				secureData: "donneesSec",
				requestId: "nom",
				session: "session",

				fileUploadOrderNumber: "numeroOrdre",
				fileUploadSession: "numeroSession",
				fileUploadRequestId: "nomRequete",
				fileUploadFileId: "idFichier",
				fileUploadMd5: "md5",
			};

			if (Version.isGreaterThanOrEqualTo202439(version)) {
				this.properties = {
					...common,
					data: "data",
					signature: "Signature",
				};
			}

			this.properties = {
				...common,
				data: "donnees",
				signature: "_Signature_",
			};
		}
	}
}

export enum HomepageSessionAccess {
	Account = 0,
	AccountConnection = 1,
	DirectConnection = 2,
	TokenAccountConnection = 3,
	TokenDirectConnection = 4,
	CookieConnection = 5,
}

export class HomepageSession {
	@deserializeWith((h: string | number) => Number(h))
	@rename("h")
	public id = t.number();

	@rename("a")
	public webspace = t.enum(Webspace);

	@rename("d")
	@defaultValue(false)
	public demo = t.option(t.boolean());

	@rename("g")
	@defaultValue(HomepageSessionAccess.Account)
	public access = t.enum(HomepageSessionAccess);

	/** @deprecated since 2023 */
	@rename("MR")
	public rsaModulus = t.option(t.string());
	/** @deprecated since 2023 */
	@rename("ER")
	public rsaExponent = t.option(t.string());

	@rename("CrA")
	@defaultValue(false)
	public enforceEncryption = t.boolean();
	@rename("CoA")
	@defaultValue(false)
	public enforceCompression = t.boolean();

	@rename("sCrA")
	@defaultValue(false)
	public skipEncryption = t.boolean();
	@rename("sCoA")
	@defaultValue(false)
	public skipCompression = t.boolean();

	/**
	 * Whether instance have an SSL certificate installed or not.
	 */
	@defaultValue(false)
	public http = t.boolean();

	/**
	 * Whether polling should be used instead of presence.
	 * @deprecated since 2025.1.3
	 */
	@defaultValue(false)
	public poll = t.boolean();
}
