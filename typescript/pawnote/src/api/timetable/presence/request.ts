export interface RequestDataResource {
	G: number;
	L: string;
	N: string;
}

export type TimetablePresenceRequestData = {
	Ressource: RequestDataResource;
};

export interface TimetablePresenceRequestSignature {
	onglet: 16; // TODO: find enum
	membre?: {
		G: number;
		N: string;
	};
}
