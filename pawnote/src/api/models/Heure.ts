import { rename, t } from "~d0/index";

export class Heure {
	@rename("G")
	public kind = t.number();

	@rename("L")
	public label = t.string();

	public A = t.option(t.boolean());
}
