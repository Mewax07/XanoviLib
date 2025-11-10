import { TypeHttpDateTime } from "../http/TypeHttpDateTime";

type TimetableRequestDataBase = {
	estEDTAnnuel: boolean;
	estEDTPermanence: boolean;
	avecAbsencesEleve: boolean;
	avecRessourcesLibrePiedHoraire: boolean;
	avecAbsencesRessource: boolean;
	avecInfosPrefsGrille: boolean;
	avecConseilDeClasse: boolean;
	avecCoursSortiePeda: boolean;
	avecDisponibilites: boolean;
	avecRetenuesEleve: boolean;
	edt: { G: 16; L: "Emploi du temps" };

	ressource: RequestDataResource;
	Ressource: RequestDataResource;
};

export interface RequestDataResource {
	G: number;
	L: string;
	N: string;
}

export interface RequestDataIntervals {
	dateDebut: TypeHttpDateTime;
	DateDebut: TypeHttpDateTime;
	dateFin?: TypeHttpDateTime;
	DateFin?: TypeHttpDateTime;
}

export interface RequestDataWeekNumber {
	numeroSemaine: number;
	NumeroSemaine: number;
}

export type TimetableRequestData = TimetableRequestDataBase & (RequestDataIntervals | RequestDataWeekNumber);

export interface TimetableRequestSignature {
	onglet: 16;
	membre?: {
		G: number;
		N: string;
	};
}
