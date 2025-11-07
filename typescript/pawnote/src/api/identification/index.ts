import { ApiFunction } from "../../core/builder";
import { RequestFunction, ResponseFunctionWrapper } from "../../models";
import { IdentificationRequest } from "./request";
import { IdentificationModel } from "./response";

export type IdentificationResponse = ResponseFunctionWrapper<IdentificationModel>;

export enum IdentificationMode {
	Credentials,
	Token,
	CAS,
	QR,
}

@ApiFunction({
	name: "Identification",
	model: IdentificationModel,
})
export class Identification extends RequestFunction<IdentificationRequest> {
	public async send(username: string, uuid: string, mode: IdentificationMode): Promise<IdentificationResponse> {
		const token = mode === IdentificationMode.Token;
		const cas = mode === IdentificationMode.CAS;
		const qr = mode === IdentificationMode.QR;

		const response = await this.execute({
			genreConnexion: 0,
			genreEspace: this.session.homepage.webspace,
			identifiant: username,
			pourENT: cas,
			enConnexionAuto: false,
			demandeConnexionAuto: false,
			enConnexionAppliMobile: token,
			demandeConnexionAppliMobile: !token,
			demandeConnexionAppliMobileJeton: qr,
			uuidAppliMobile: uuid,
			loginTokenSAV: "",
			// Let's keep values coherent with our `User-Agent` header value.
			informationsAppareil: {
				// device.model @ https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html#devicemodel
				//              @ https://www.theiphonewiki.com/wiki/Models
				modele: "iPhone18,3", // iPhone 17
				// device.platform @ https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html#deviceplatform
				platforme: "iOS",
			},
		});

		return this.decoder.decode(response);
	}
}
