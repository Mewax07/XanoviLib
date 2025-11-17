import { Instance } from "../instance";
import { PendingLogin } from "../pending_login";
import { Parent } from "../user/parent";
import { Webspace } from "../webspace";
import { LoginPortal } from "./login_portal";

export class ParentLoginPortal extends LoginPortal {
	public constructor(instance: Instance) {
		super(instance);
	}

	public async credentials(
		username: string,
		password: string,
		deviceUUID = crypto.randomUUID() as string,
		navigatorIdentifier: string | null = null,
	) {
		return super._credentials(Webspace.Parents, username, password, deviceUUID, navigatorIdentifier);
	}

	public async token(
		username: string,
		token: string,
		deviceUUID: string,
		navigatorIdentifier: string | null = null,
	): Promise<PendingLogin> {
		return super._token(Webspace.Parents, username, token, deviceUUID, navigatorIdentifier);
	}

	public async finish(login: PendingLogin): Promise<Parent> {
		return new Parent(await super._finish(login), login._session, login._parameters, login._authentication);
	}
}
