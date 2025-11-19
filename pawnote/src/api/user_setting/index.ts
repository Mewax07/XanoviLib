import { Session } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { UserSettingRequest } from "./request";
import { UserSettingModel, UserSettingSignature } from "./response";

export type UserSettingResponse = ResponseFunctionWrapper<UserSettingModel, UserSettingSignature>;

export class UserSettingAPI extends RequestFunction<UserSettingRequest> {
	private static readonly name = "ParametresUtilisateur";

	private readonly decoder = new ResponseFunction(this.session, UserSettingModel, UserSettingSignature);

	public constructor(session: Session) {
		super(session, UserSettingAPI.name);
	}

	public async send(): Promise<UserSettingResponse> {
		const response = await this.execute({});

		return this.decoder.decode(response);
	}
}
