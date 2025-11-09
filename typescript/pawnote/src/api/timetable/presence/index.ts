import { Child, Session, Student } from "../../../models";
import { RequestFunction } from "../../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../../models/response";
import { TimetablePresenceRequestData, TimetablePresenceRequestSignature } from "./request";
import { TimetablePresenceModel } from "./response";

export type TimetablePresenceResponse = ResponseFunctionWrapper<TimetablePresenceModel>;

export class TimetablePresence extends RequestFunction<
	TimetablePresenceRequestData,
	TimetablePresenceRequestSignature
> {
	private static readonly name = "PageEmploiDuTemps_DomainePresence";

	private readonly decoder = new ResponseFunction(this.session, TimetablePresenceModel);

	public constructor(
		session: Session,
		private readonly resource: Student | Child,
	) {
		super(session, TimetablePresence.name);
	}

	public async send(): Promise<TimetablePresenceResponse> {
		const response = await this.execute(
			{
				Ressource: {
					G: this.resource.kind,
					L: this.resource.name,
					N: this.resource.id,
				},
			},
			{
				onglet: 16,
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
