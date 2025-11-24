import { Child, Student, User } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { EntityState } from "../models/entity";
import { AssignmentRequest, AssignmentRequestSignature } from "./request";
import { AssignmentModel } from "./response";

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

	public async send(id: string, done: boolean = true): Promise<AssignmentResponse> {
		const response = await this.execute(
			{
				listeTAF: [
					{
						E: EntityState.MODIFICATION,
						TAFFait: done,
						N: id,
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
