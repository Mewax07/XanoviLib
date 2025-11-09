import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { TypeHttpElement } from "../http/TypeHttpElement";
import { TypeHttpNote } from "../http/TypeHttpNote";

export class HomeworkContent {
    @rename("N")
    public id = t.string();

    // TODO: Search value of the array
    // @rename("originesCategorie")
    // public category = t.array(t.reference())
}

export class Content {
    @rename("N")
    public id = t.option(t.string());

    @rename("L")
    public label = t.string();

    @rename("G")
    public kind = t.number();
}

export class Course {
    @rename("N")
    public id = t.number();

    @rename("G")
    public kind = t.number();

    @rename("P")
    public position = t.option(t.number());

    @rename("place")
    public start = t.number();

    @rename("duree")
    public duringTime = t.number();

    @rename("CouleurFond")
    public backgroundColor = t.string();

    @rename("DateDuCours")
    @deserializeWith(TypeHttpDateTime.deserializer)
    public courseDate = t.instance(Date);

    @rename("ListeContenus")
    @deserializeWith(new TypeHttpElement(Content).array)
    public content = t.array(t.reference(Content));

    @rename("cahierDeTextes")
    @deserializeWith(new TypeHttpElement(HomeworkContent).single)
    public homework = t.option(t.reference(HomeworkContent));

    @rename("AvecTafPublie")
    public withHomeworkPublished = t.boolean();

    @rename("AvecCdT")
    public withCahierDeTextes = t.option(t.boolean());
}

export class Service {
    @rename("L")
    public label = t.string();

    @rename("N")
    public id = t.string();

    @rename("G")
    public kind = t.number();

    @rename("couleur")
    public color = t.string();
}

export class Periode {
    @rename("L")
    public label = t.string();

    @rename("N")
    public id = t.string();
}

export class Note {
    @rename("N")
    public id = t.string();

    @rename("G")
    public kind = t.number();

    @rename("bareme")
    @deserializeWith(TypeHttpNote.deserializer)
    public scale = t.instance(TypeHttpNote);

    @rename("baremeParDefaut")
    @deserializeWith(TypeHttpNote.deserializer)
    public defaultScale = t.instance(TypeHttpNote);

    @deserializeWith(TypeHttpDateTime.deserializer)
    public date = t.instance(Date);

    @deserializeWith(TypeHttpNote.deserializer)
    public note = t.instance(TypeHttpNote);

    @rename("periode")
    @deserializeWith(new TypeHttpElement(Periode).single)
    public period = t.array(t.reference(Periode));

    @deserializeWith(new TypeHttpElement(Service).single)
    public service = t.array(t.reference(Service));
}

export class Notes {
    @rename("avecDetailDevoir")
    public withDetailAssignment = t.boolean();

    @rename("avecDetailService")
    public withDetailService = t.option(t.boolean());

    @rename("listeDevoirs")
    @deserializeWith(new TypeHttpElement(Note).array)
    public homework = t.array(t.reference(Note));
}

export class Recess {
	@rename("L")
	public name = t.string();

	@rename("place")
	public slot = t.number();
}

export class LunchIcon {
	@rename("text")
	public text = t.string();

	@rename("check")
	public check = t.boolean();
}

export class LunchPeriod {
	@rename("icone")
	public icon = t.reference(LunchIcon);

	@rename("hint")
	public hint = t.string();
}

export class Lunch {
	@rename("midi")
	public lunch = t.option(t.reference(LunchPeriod));
}

export class DayCycle {
	@rename("jourCycle")
	public dayCycle = t.number();

	@rename("numeroSemaine")
	public weekNumber = t.number();

	@rename("DP")
	public lunch = t.reference(Lunch);
}

export class Absences {
	@rename("joursCycle")
	@deserializeWith(new TypeHttpElement(DayCycle).array)
	public dayCycles = t.array(t.reference(DayCycle));
}

export class GridPreferences {
	@rename("genreRessource")
	public resourceType = t.number();
}
