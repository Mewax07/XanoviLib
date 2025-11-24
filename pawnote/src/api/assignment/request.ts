import { EntityState } from "../models/entity";

export type AssignmentRequest = AssignmentRequestStatus | AssignmentRequestRemove;

export interface AssignmentRequestStatus {
	listeTAF: [
		{
			E: EntityState;
			TAFFait: boolean;
			N: string;
		},
	];
}

export interface AssignmentRequestRemove {
	listeFichiers: [
		{
			E: EntityState;
			TAF: {
				N: string;
			};
		},
	];
}

export interface AssignmentRequestSignature {
	onglet: 88;
	membre?: {
		G: number;
		N: string;
	};
}
