import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpHtmlSafe } from "../http/TypeHttpHtmlSafe";

export class MentionsPagesPubliques {
	@rename("lien")
	@deserializeWith(TypeHttpHtmlSafe.deserializer)
	public link = t.string();
}
