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
