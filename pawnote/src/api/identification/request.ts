import { Webspace } from "../../models";

export interface IdentificationRequest {
	// NOTE: only teachers can have a different one, apparently!
	genreConnexion: number;
	genreEspace: Webspace | ((path: string) => Webspace) | ((webspace: Webspace) => string);
	identifiant: string;
	pourENT: boolean;
	enConnexionAuto: boolean;
	demandeConnexionAuto: boolean;
	enConnexionAppliMobile: boolean;
	demandeConnexionAppliMobile: boolean;
	demandeConnexionAppliMobileJeton: boolean;
	uuidAppliMobile: string;
	loginTokenSAV: string;

	informationsAppareil: {
		modele: string; // iPhone 17
		platforme: string;
	};
}
