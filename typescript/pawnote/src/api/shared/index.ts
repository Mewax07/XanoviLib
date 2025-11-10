import { defaultValue, deserializeWith, rename, t } from "~d0/index";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { TypeHttpElement } from "../http/TypeHttpElement";
import { TypeHttpNote } from "../http/TypeHttpNote";
import { AttachmentDifficulty, AttachmentReturnKind } from "../models/attachment";

export class Id {
	@rename("N")
	public id = t.string();
}

export class HomeworkPointer extends Id {
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
	@deserializeWith(new TypeHttpElement(HomeworkPointer).single)
	public homework = t.option(t.reference(HomeworkPointer));

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
	public listAssignments = t.array(t.reference(Note));
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

export class ResourceSubject extends Id {}

export class Resource {
	@rename("G")
	public kind = t.number();

	// TODO: Search value of the array
	// @rename("ListeThemes")

	@deserializeWith(TypeHttpDateTime.deserializer)
	public date = t.reference(Date);

	@rename("matiere")
	@deserializeWith(new TypeHttpElement(ResourceSubject).single)
	public subject = t.array(t.reference(ResourceSubject));

	@rename("ressources")
	@deserializeWith(new TypeHttpElement(Content).array)
	public resources = t.array(t.reference(Content));
}

export class EducationalResource {
	@rename("listeMatieres")
	@deserializeWith(new TypeHttpElement(Service).array)
	public listOfContents = t.array(t.reference(Service));

	@rename("listeRessources")
	@deserializeWith(new TypeHttpElement(Resource).array)
	public listResources = t.array(t.reference(Resource));
}

export class HomeworkContentSubject {
	@rename("L")
	public labal = t.string();

	@rename("N")
	public id = t.string();
}

export class HomeworkBase {
	@rename("N")
	public id = t.string();

	@rename("duree")
	public duringTime = t.number();

	@rename("CouleurFond")
	public backgroundColor = t.string();

	@rename("peuRendre")
	public canComplete = t.option(t.boolean());

	@rename("avecRendu")
	public withReturn = t.option(t.boolean());

	@rename("TAFFait")
	public done = t.boolean();

	@rename("genreRendu")
	public returnType = t.option(t.enum(AttachmentReturnKind));

	@rename("niveauDifficulte")
	public difficultyLevel = t.option(t.enum(AttachmentDifficulty));
}

export class _Homework extends HomeworkBase {
	@rename("nomPublic")
	public publicName = t.option(t.string());

	@rename("libelleCBTheme")
	public themeLabel = t.option(t.string());

	@rename("avecMiseEnForme")
	public withFormat = t.boolean();

	@rename("DonneLe")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public givenOn = t.instance(Date);

	@rename("PourLe")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public dueOn = t.instance(Date);

	@rename("Matiere")
	@deserializeWith(new TypeHttpElement(HomeworkContentSubject).single)
	public subject = t.array(t.reference(HomeworkContentSubject));

	@rename("cours")
	@deserializeWith(new TypeHttpElement(Id).single)
	public course = t.array(t.reference(Id));
}

export class HomeworkContent extends HomeworkBase {
	@rename("G")
	public kind = t.number();

	@rename("donneLe")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public givenOn = t.instance(Date);

	@rename("pourLe")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public dueOn = t.instance(Date);

	@rename("ordre")
	public order = t.number();

	@rename("matiere")
	@deserializeWith(new TypeHttpElement(HomeworkContentSubject).single)
	public subject = t.array(t.reference(HomeworkContentSubject));
}

export class Homework {
	@rename("listeTAF")
	@deserializeWith(new TypeHttpElement(HomeworkContent).array)
	public dayCycles = t.array(t.reference(HomeworkContent));
}
