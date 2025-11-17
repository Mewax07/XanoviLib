import { TypeHttpDateTime } from "../http/TypeHttpDateTime";

export interface HomepageRequestData {
	EDT: {
		numeroSemaine: number;
	};
	TAFARendre: {
		date: TypeHttpDateTime;
	};
	TAFEtActivites: {
		date: TypeHttpDateTime;
	};
	avecConseilDeClasse: boolean;
	coursNonAssures: {
		numeroSemaine: number;
	};
	dateGrille: TypeHttpDateTime;
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
		date: TypeHttpDateTime;
	};
	modificationsEDT: {
		date: TypeHttpDateTime;
	};
	numeroSemaine: number;
	partenaireCDI: {
		CDI: {};
	};
	personnelsAbsents: {
		numeroSemaine: number;
	};
	previsionnelAbsServiceAnnexe: {
		date: TypeHttpDateTime;
	};
	registreAppel: {
		date: TypeHttpDateTime;
	};
	tableauDeBord: {
		date: TypeHttpDateTime;
	};
}

export interface HomepageRequestSignature {
	onglet: 7;
}
