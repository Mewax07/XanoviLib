import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { TypeHttpElement } from "../http/TypeHttpElement";
import { TypeHttpNote } from "../http/TypeHttpNote";
import { Absences, Actualities, AgendaList, Content, Course, HomeworkBase, HomeworkContentSubject, Id, Recess } from "../shared";

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

export class HomepageModel {
	@rename("ListeCours")
	public courseList = t.array(t.reference(Course));

	@rename("absences")
	public absences = t.reference(Absences);

	@rename("actualites")
	public actualities = t.option(t.reference(Actualities));

	public agenda = t.reference(AgendaList);

	@rename("avecCoursAnnule")
	public withCanceledCourse = t.boolean();

	@rename("premierePlaceHebdoDuJour")
	public firstSlotOfTheDay = t.number();

	@rename("debutDemiPensionHebdo")
	public startLunchWeek = t.number();

	@rename("finDemiPensionHebdo")
	public endLunchWeek = t.number();

	public notes = t.reference(Notes);

	@rename("recreations")
	@deserializeWith(new TypeHttpElement(Recess).array)
	public recesses = t.array(t.reference(Recess));

	@rename("travailAFaire")
	public homework = t.reference(Homework);
}
