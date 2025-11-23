import { Child, Student, User } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { PresenceRequest, PresenceRequestSignature } from "./request";
import { PresenceModel } from "./response";

export type PresenceResponse = ResponseFunctionWrapper<PresenceModel>;

export class Presence extends RequestFunction<PresenceRequest, PresenceRequestSignature> {
    private static readonly name = "Navigation";

	private readonly user: User;
    private readonly decoder: any;

    constructor(
        user: User,
        private readonly resource: Student | Child,
    ) {
        super(user.session, Presence.name);
        this.user = user;
        this.decoder = new ResponseFunction(this.session, PresenceModel);
    }

	public async send(): Promise<PresenceResponse> {
		const response = await this.execute(
			{
			},
			{
				onglet: 7,
				membre: this.resource instanceof Child
					? {
						G: this.resource.kind,
						N: this.resource.id,
					}
					: void 0,
			}
		);

		return this.decoder.decode(response);
	}
}
