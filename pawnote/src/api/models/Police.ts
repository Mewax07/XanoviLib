import { rename, t } from "~d0/index";

export class Police {
	@rename("L")
	public name = t.string();
}
