export enum AttachmentKind {
	Link = 0,
	File = 1,
}

export enum AttachmentDifficulty {
	None = 0,
	Easy = 1,
	Medium = 2,
	Hard = 3,
}

export enum AttachmentReturnKind {
	None = 0,
	Paper = 1,
	FileUpload = 2,
	Kiosk = 3,

	// Only available since version 2024
	AudioRecording = 4,
}
