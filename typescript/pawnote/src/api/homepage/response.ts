import { defaultValue, deserializeWith, rename, t } from "~d0/index";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { TypeHttpElement } from "../http/TypeHttpElement";
import { Absences, Course, Notes, Recess } from "../shared";

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

export class HomepageModel {
	@rename("ListeCours")
	public courseList = t.array(t.reference(Course));

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

	@rename("absences")
	public absences = t.reference(Absences);

	@rename("recreations")
	@deserializeWith(new TypeHttpElement(Recess).array)
	public recesses = t.array(t.reference(Recess));

	public notes = t.reference(Notes);
}
