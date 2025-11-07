import { ObjectDate } from "../interface/Date";

export interface HomepageRequest {
	EDT: {
		numeroSemaine: number;
	};
	TAFARendre: {
		date: ObjectDate;
	};
	TAFEtActivites: {
		date: ObjectDate;
	};
	avecConseilDeClasse: boolean;
	coursNonAssures: {
		numeroSemaine: number;
	};
	dateGrille: ObjectDate;
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
		date: ObjectDate;
	};
	modificationsEDT: {
		date: ObjectDate;
	};
	numeroSemaine: number;
	partenaireCDI: {
		CDI: {};
	};
	personnelsAbsents: {
		numeroSemaine: number;
	};
	previsionnelAbsServiceAnnexe: {
		date: ObjectDate;
	};
	registreAppel: {
		date: ObjectDate;
	};
	tableauDeBord: {
		date: ObjectDate;
	};
}
