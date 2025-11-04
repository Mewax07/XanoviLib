import { rename, t } from "~d0/index";

export class AccountSecurityDoubleAuthModel {
	@rename("result")
	public ok = t.option(t.boolean());

	@rename("dejaConnu")
	public alreadyKnown = t.option(t.boolean());

	@rename("jetonConnexionAppMobile")
	public token = t.option(t.string());
}
