import { rename, t } from "~d0/index";

export class Recreation {
	@rename("L")
	public label = t.string();

	@rename("place")
	public slot = t.number();
}
