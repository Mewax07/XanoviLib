import { bytesToHex } from "@noble/ciphers/utils.js";
import { AccessDeniedError, AccountDisabledError, AuthenticateError, BadCredentialsError, Session } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { AuthentificationRequest } from "./request";
import { AuthentificationModel } from "./response";

export type AuthentificationResponse = ResponseFunctionWrapper<AuthentificationModel>;

export class AuthentificationAPI extends RequestFunction<AuthentificationRequest> {
	private static readonly name = "Authentification";

	private readonly decoder = new ResponseFunction(this.session, AuthentificationModel);

	public constructor(session: Session) {
		super(session, AuthentificationAPI.name);
	}

	public async send(solution: Uint8Array): Promise<AuthentificationResponse> {
		const response = await this.execute({
			connexion: 0,
			challenge: bytesToHex(solution),
			espace: this.session.homepage.webspace,
		});

		const decoded = await this.decoder.decode(response);

		if (decoded.data.access) {
			switch (decoded.data.access) {
				case 1: // EGenreErreurAcces.Identification
					throw new BadCredentialsError();

				case 2: // EGenreErreurAcces.Autorisation
				case 3: // EGenreErreurAcces.ConnexionClasse
				case 4: // EGenreErreurAcces.AucuneRessource
				case 5: // EGenreErreurAcces.Connexion
				case 7: // EGenreErreurAcces.FonctionAccompagnant
				case 8: // EGenreErreurAcces.AccompagnantAucunEleve
					throw new AccessDeniedError();

				case 6: // EGenreErreurAcces.BloqueeEleve
				case 10: // EGenreErreurAcces.CompteDesactive
					throw new AccountDisabledError();

				case 9: // EGenreErreurAcces.Message
					if ("AccesMessage" in decoded.data) {
						const access = decoded.data.AccesMessage as any;
						let error: string = access.message ?? "(none)";

						if (access.titre) {
							error += `${access.titre} ${error}`;
						}

						throw new AuthenticateError(error);
					}
			}
		}

		return decoded;
	}
}
