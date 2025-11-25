import { RequestUpload } from "~p0/models/upload";
import { Child, Student, UploadSizeError, User } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { DocumentKind } from "../models/document";
import { EntityState } from "../models/entity";
import {
	AssignmentDataRemove,
	AssignmentDataStatus,
	AssignmentDataUpload,
	AssignmentRequest,
	AssignmentRequestSignature,
} from "./request";
import { AssignmentModel } from "./response";
import { createEntityID } from "~p0/core/entity";

export type AssignmentResponse = ResponseFunctionWrapper<AssignmentModel>;

export class AssignmentAPI extends RequestFunction<AssignmentRequest, AssignmentRequestSignature> {
	private static readonly name = "SaisieTAFFaitEleve";

	private readonly user: User;
	private readonly decoder: any;

	constructor(
		user: User,
		private readonly resource: Student | Child,
	) {
		super(user.session, AssignmentAPI.name);
		this.user = user;
		this.decoder = new ResponseFunction(this.session, AssignmentModel);
	}

	public async send(
		data: AssignmentDataStatus | AssignmentDataUpload | AssignmentDataRemove,
	): Promise<AssignmentResponse> {
		if (data.type === "upload") {
			// Check if the file can be uploaded.
			// Otherwise we'll get an error during the upload.
			// @ts-expect-error : trust the process.
			const fileSize: number | undefined = data.file.size || data.file.byteLength;
			const maxFileSize = this.user.user.authorizations.maxAssignmentFileUploadSize;
			if (typeof fileSize === "number" && fileSize > maxFileSize) {
				throw new UploadSizeError(maxFileSize);
			}

			const fileUpload = new RequestUpload(this.session, "SaisieTAFARendreEleve", data.file, data.fileName);
			await fileUpload.execute();

			const response = await this.execute(
				{
					listeFichiers: [
						{
							E: EntityState.CREATION,
							G: DocumentKind.FILE,
							L: data.fileName,
							N: createEntityID(),
							idFichier: fileUpload.id,
							TAF: { N: data.assignmentId },
						},
					],
				},
				{
					onglet: 88,
					membre:
						this.resource instanceof Child
							? {
									G: this.resource.kind,
									N: this.resource.id,
								}
							: void 0,
				},
			);

			return this.decoder.decode(response);
		} else if (data.type === "remove") {
			const response = await this.execute(
				{
					listeFichiers: [
						{
							E: EntityState.MODIFICATION,
							TAF: {
								N: data.assignmentId
							}
						},
					],
				},
				{
					onglet: 88,
					membre:
						this.resource instanceof Child
							? {
									G: this.resource.kind,
									N: this.resource.id,
								}
							: void 0,
				},
			);

			return this.decoder.decode(response);
		} else {
			const response = await this.execute(
				{
					listeTAF: [
						{
							E: EntityState.MODIFICATION,
							TAFFait: data.done,
							N: data.assignmentId,
						},
					],
				},
				{
					onglet: 88,
					membre:
						this.resource instanceof Child
							? {
									G: this.resource.kind,
									N: this.resource.id,
								}
							: void 0,
				},
			);

			return this.decoder.decode(response);
		}
	}
}
