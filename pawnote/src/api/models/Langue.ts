import { rename, t } from "~d0/index";

export class Langue {
	@rename("langID")
	public languageIdentifier = t.number();

	@rename("description")
	public label = t.string();
}
