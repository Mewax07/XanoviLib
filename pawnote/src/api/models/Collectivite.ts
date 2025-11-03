import { rename, t } from "~d0/index";

export class Collectivite {
	@rename("L")
	public label = t.string();

	@rename("genreCollectivite")
	public kind = t.number();
}
