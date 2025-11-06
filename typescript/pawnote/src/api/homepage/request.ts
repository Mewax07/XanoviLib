import { Date } from "../types";

export interface HomepageRequest {
	EDT: {
		numeroSemaine: number;
	};
	TAFARendre: {
		date: Date;
	};
	TAFEtActivites: {
		date: Date;
	};
	avecConseilDeClasse: boolean;
	coursNonAssures: {
		numeroSemaine: number;
	};
	dateGrille: Date;
	donneesProfs: {
		numeroSemaine: number;
	};
	donneesVS: {
		numeroSemaine: number;
	};
	exclusions: {
		numeroSemaine: number;
	};
	incidents: {
		numeroSemaine: number;
	};
	menuDeLaCantine: {
		date: Date;
	};
	modificationsEDT: {
		date: Date;
	};
	numeroSemaine: number;
	partenaireCDI: {
		CDI: {};
	};
	personnelsAbsents: {
		numeroSemaine: number;
	};
	previsionnelAbsServiceAnnexe: {
		date: Date;
	};
	registreAppel: {
		date: Date;
	};
	tableauDeBord: {
		date: Date;
	};
}
