import { bytesToHex } from "@noble/ciphers/utils.js";
import { RequestFunction } from "../../models/request";
import { TypeCommandeSecurisationCompteHttp } from "../models/TypeCommandeSecurisationCompteHttp";
import { TypeModeGestionDoubleAuthentification } from "../models/TypeModeGestionDoubleAuthentification";
import { AccountSecurityDoubleAuthRequest } from "./request";
import { AccountSecurityDoubleAuthModel } from "./response";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { Session } from "../../models";

export type AccountSecurityDoubleAuthResponse = ResponseFunctionWrapper<AccountSecurityDoubleAuthModel>;

export class AccountSecurityDoubleAuth extends RequestFunction<AccountSecurityDoubleAuthRequest> {
	public static readonly name = "SecurisationCompteDoubleAuth";

	private readonly decoder = new ResponseFunction(this.session, AccountSecurityDoubleAuthModel);

	public constructor(session: Session) {
		super(session, AccountSecurityDoubleAuth.name);
	}

	public async sendPasswordCheck(password: string): Promise<boolean> {
		const response = await this.execute({
			action: TypeCommandeSecurisationCompteHttp.csch_VerifierMotDePassePersonnalise,
			nouveauMDP: bytesToHex(this.session.aes.encrypt(password)),
		});

		const { data } = await this.decoder.decode(response);
		return data.ok === true;
	}

	public async sendPinVerify(pin: string): Promise<boolean> {
		const response = await this.execute({
			action: TypeCommandeSecurisationCompteHttp.csch_VerifierPIN,
			codePin: bytesToHex(this.session.aes.encrypt(pin)),
		});

		const { data } = await this.decoder.decode(response);
		return data.ok === true;
	}

	public async sendSourceAlreadyKnown(source: string): Promise<boolean> {
		const response = await this.execute({
			action: TypeCommandeSecurisationCompteHttp.csch_LibellesSourceConnexionDejaConnus,
			libelle: source,
		});

		const { data } = await this.decoder.decode(response);
		return data.alreadyKnown === true;
	}

	public async save(
		mode?: TypeModeGestionDoubleAuthentification,
		password?: string,
		pin?: string,
		source?: string,
	): Promise<string | null> {
		const payload: AccountSecurityDoubleAuthRequest = {
			action: TypeCommandeSecurisationCompteHttp.csch_EnregistrerChoixUtilisateur,
			mode,
		};

		if (password) {
			payload.nouveauMDP = bytesToHex(this.session.aes.encrypt(password));
		}

		if (pin) {
			payload.codePin = bytesToHex(this.session.aes.encrypt(pin));
		}

		if (source) {
			payload.avecIdentification = true;
			payload.strIdentification = source;
		}

		const response = await this.execute(payload);
		const { data } = await this.decoder.decode(response);
		return data.token;
	}
}
