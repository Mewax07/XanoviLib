import { Webspace } from "../../models";

export interface AuthentificationRequest {
	connexion: number;
	challenge: string;
	espace: Webspace | ((path: string) => Webspace) | ((webspace: Webspace) => string);
}
