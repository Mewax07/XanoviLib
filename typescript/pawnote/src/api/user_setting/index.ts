import { ApiFunction } from "../../core/builder";
import { RequestFunction, ResponseFunctionWrapper } from "../../models";
import { UserSettingRequest } from "./request";
import { UserSettingModel, UserSettingSignature } from "./response";

export type UserSettingResponse = ResponseFunctionWrapper<UserSettingModel, UserSettingSignature>;

@ApiFunction({
	name: "ParametresUtilisateur",
	model: UserSettingModel,
	signature: UserSettingSignature,
})
export class UserSetting extends RequestFunction<UserSettingRequest> {
	public async send(
		//withInvalidPassword?: boolean
	): Promise<UserSettingResponse> {
		const response = await this.execute({
			// motDePasseInvalide: withInvalidPassword, // TODO: This is a stupid feature
		});

		return this.decoder.decode(response);
	}
}

/*
export class UserSetting extends RequestFunction<UserSettingRequest> {
	private static readonly name = "ParametresUtilisateur";

	private readonly decoder = new ResponseFunction(this.session, UserSettingModel, UserSettingSignature);

	public constructor(session: Session) {
		super(session, UserSetting.name);
	}

	public async send(
		//withInvalidPassword?: boolean
	): Promise<UserSettingResponse> {
		const response = await this.execute({
			// motDePasseInvalide: withInvalidPassword, // TODO: This is a stupid feature
		});

		return this.decoder.decode(response);
	}
}
*/
