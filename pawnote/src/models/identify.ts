import { bytesToUtf8, hexToBytes } from "@noble/ciphers/utils.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";
import { IdentificationResponse } from "../api/identification";
import { BadCredentialsError } from "./errors";
import { Session } from "./session";

export class Identity {
	public constructor(private readonly _raw: IdentificationResponse) {}

	public createMiddlewareKey(username: string, mod: string): Uint8Array {
		try {
			if (this._raw.data.lowerUsername) username = username.toLowerCase();

			if (this._raw.data.lowerMod) mod = mod.toLowerCase();

			const hash = bytesToHex(
				sha256
					.create()
					.update(utf8ToBytes(this._raw.data.seed ?? ""))
					.update(utf8ToBytes(mod.trim()))
					.digest(),
			).toUpperCase();

			return utf8ToBytes(username + hash);
		} catch {
			throw new BadCredentialsError();
		}
	}

	public solveChallenge(session: Session, middlewareKey: Uint8Array): Uint8Array {
		try {
			const pkey = session.aes.key;
			session.aes.key = middlewareKey; // temp switch key

			const encoded = bytesToUtf8(session.aes.decrypt(hexToBytes(this._raw.data.challenge)));
			const decoded = encoded
				.split("")
				.filter((_, i) => i % 2 === 0)
				.join("");

			const response = session.aes.encrypt(decoded);
			session.aes.key = pkey; // revert key
			return response;
		} catch {
			throw new BadCredentialsError();
		}
	}

	public get username(): string | null {
		return this._raw.data.username;
	}
}
