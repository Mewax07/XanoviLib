import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";

export class JoursFeries {
    @rename("L")
    public label = t.string();

    @rename("N")
    public id = t.string();

    @rename("dateDebut")
    @deserializeWith(TypeHttpDateTime.deserializer)
    public startDate = t.instance(Date);

    @rename("dateFin")
    @deserializeWith(TypeHttpDateTime.deserializer)
    public endDate = t.instance(Date);
}
