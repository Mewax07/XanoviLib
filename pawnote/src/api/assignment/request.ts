import { FormDataFile } from "schwi";
import { DocumentKind } from "../models/document";
import { EntityState } from "../models/entity";

export type AssignmentRequest = AssignmentRequestStatus | AssignmentRequestUpload | AssignmentRequestRemove;

export interface AssignmentRequestStatus {
	listeTAF: [
		{
			E: EntityState;
			TAFFait: boolean;
			N: string;
		},
	];
}

export interface AssignmentRequestUpload {
	listeFichiers: [
		{
			E: EntityState;
			G: DocumentKind;
			L: string;
			N: number;
			idFichier: string;
			TAF: {
				N: string;
			};
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

export interface AssignmentDataStatus {
	type: "status",
	assignmentId: string;
	done: boolean
}

export interface AssignmentDataUpload {
	type: "upload",
	assignmentId: string;
	file: FormDataFile;
	fileName: string;
}

export interface AssignmentDataRemove {
	type: "remove",
	assignmentId: string;
}

export interface AssignmentRequestSignature {
	onglet: 88;
	membre?: {
		G: number;
		N: string;
	};
}
