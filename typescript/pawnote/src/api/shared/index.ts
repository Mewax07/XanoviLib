import { defaultValue, deserializeWith, rename, t } from "~d0/index";
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

export class Actuality {
	@rename("L")
	public label = t.string();

	@rename("N")
	public id = t.string();

	@rename("auteur")
	public author = t.string();

	@rename("dateCreation")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public creationDate = t.instance(Date);

	@rename("dateDebut")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public startDate = t.instance(Date);

	@rename("dateFin")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public endDate = t.instance(Date);

	@rename("estInformation")
	@defaultValue(true)
	public isInformation = t.option(t.boolean());

	@rename("estSondage")
	@defaultValue(false)
	public isSurvey = t.option(t.boolean());

	@rename("lue")
	@defaultValue(false)
	public readed = t.option(t.boolean());
}

export class Actualities {
	@rename("listeActualites")
	@deserializeWith(new TypeHttpElement(Actuality).array)
	public actualitiesList = t.array(t.reference(Actuality));
}

export class Agenda {
	@rename("L")
	public label = t.string();

	@rename("N")
	public id = t.string();

	@rename("G")
	public kind = t.number();

	@rename("DateDebut")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public startDate = t.instance(Date);

	@rename("DateFin")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public endDate = t.instance(Date);

	@rename("Commentaire")
	public comment = t.string();

	@rename("CouleurCellule")
	public celluleColor = t.string();

	@rename("sansHorraire")
	public noSchedule = t.option(t.boolean());
}

export class AgendaList {
	@rename("listeEvenements")
	public eventsList = t.array(t.reference(Agenda));
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

export class Subject {
	@rename("N")
	public id = t.string();
}

export class Resource {
	@rename("G")
	public kind = t.number();

	// TODO: Search value of the array
	// @rename("ListeThemes")

	@deserializeWith(TypeHttpDateTime.deserializer)
	public date = t.reference(Date);

	@rename("matiere")
	@deserializeWith(new TypeHttpElement(Subject).single)
	public subject = t.array(t.reference(Subject));

	@rename("ressources")
	@deserializeWith(new TypeHttpElement(Content).array)
	public resources = t.array(t.reference(Content));
}

export class EducationalResource {
	@rename("listeMatieres")
	@deserializeWith(new TypeHttpElement(Service).array)
	public listOfContents = t.array(t.reference(Service));

	@rename("listeRessources")
	@deserializeWith(new TypeHttpElement(Service).array)
	public listResources = t.array(t.reference(Service));
}
