import { Domaine } from "../../../http/TypeHttpDomaine";

export type HomeworkRequest = RequestDataIntervals;

export interface RequestDataIntervals {
	domaine: Domaine;
	sansRequeteRP: boolean;
}

export interface HomeworkRequestSignature {
	onglet: 89;
	membre?: {
		G: number;
		N: string;
	};
}
