import { UserSettingResponse } from "../api/user_setting";
import { Resources } from "../api/user_setting/response";

export class UserParameters {
	public constructor(
		private readonly _raw: UserSettingResponse
	) {}

	public get resource(): Resources {
		return this._raw.data.resources;
	}
}
