import { EntityState } from "../models/entity";

export interface AssignmentRequest {
	listeTAF: [
		{
			E: EntityState;
			TAFFait: boolean;
			N: string;
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
