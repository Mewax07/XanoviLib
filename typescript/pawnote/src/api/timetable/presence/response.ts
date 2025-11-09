import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpDomaine } from "~p0/api/http/TypeHttpDomaine";

export class TimetablePresenceModel {
	@rename("Domaine")
	@deserializeWith(TypeHttpDomaine.deserializer)
	public domain = t.array(t.reference(TypeHttpDomaine));

	@rename("joursPresence")
	@deserializeWith(TypeHttpDomaine.deserializer)
	public daysPresence = t.array(t.reference(TypeHttpDomaine));
}
