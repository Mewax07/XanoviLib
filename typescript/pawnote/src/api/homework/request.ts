import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { Domaine } from "../http/TypeHttpDomaine";

export type HomeworkRequest = RequestDataIntervals | RequestDataDate;

export interface RequestDataIntervals {
	domaine: Domaine;
}

export interface RequestDataDate {
	date: TypeHttpDateTime;
}

export interface HomeworkRequestSignature {
	onglet: 88;
	membre?: {
		G: number;
		N: string;
	};
}
