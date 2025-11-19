import { Child, Student, User } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { TypeHttpDomaine } from "../http/TypeHttpDomaine";
import { HomeworkRequest, HomeworkRequestSignature, RequestDataDate, RequestDataIntervals } from "./request";
import { HomeworkModel } from "./response";

export type HomeworkResponse = ResponseFunctionWrapper<HomeworkModel>;

export class HomeworkAPI extends RequestFunction<HomeworkRequest, HomeworkRequestSignature> {
	private static readonly name = "PageCahierDeTexte";

	private readonly user: User;
	private readonly decoder: ResponseFunction<any, any>;

	constructor(
		user: User,
		private readonly resource: Student | Child,
	) {
		super(user.session, HomeworkAPI.name);
		this.user = user;
		this.decoder = new ResponseFunction(this.session, HomeworkModel);
	}

	public async send(data: RequestDataIntervals | RequestDataDate): Promise<HomeworkResponse> {
		const response = await this.execute(
			{
				...data,
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

	public sendIntervals(startWeek?: number, endWeek?: number): Promise<HomeworkResponse> {
		const domaine = new TypeHttpDomaine(`[${startWeek ?? 1}..${endWeek ?? 52}]`).serialize();

		return this.send({
			domaine,
		});
	}

	public sendSinceDate(date?: Date): Promise<HomeworkResponse> {
		const n = date ? date : new Date();
		const serializer = TypeHttpDateTime.serializer(n);

		return this.send({
			date: serializer,
		});
	}
}
