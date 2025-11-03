import { rename, t } from "~d0/index";

export class Onglet {
	@rename("G")
	public tab = t.number();

	@rename("Onglet")
	public sub = t.option(t.array(t.reference(Onglet)));
}
