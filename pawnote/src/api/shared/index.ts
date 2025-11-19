import { defaultValue, deserializeWith, rename, t } from "~d0/index";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { TypeHttpElement } from "../http/TypeHttpElement";
import { AttachmentDifficulty, AttachmentReturnKind } from "../models/attachment";
import { TypeOrigineCreationCategorieCahierDeTexte } from "../models/TypeOrigineCreationCategorieCahierDeTexte";

export class Id {
	@rename("N")
	public id = t.string();
}

export class Content {
	@rename("N")
	public id = t.option(t.string());

	@rename("L")
	public label = t.string();

	@rename("G")
	public kind = t.number();

	@rename("estHoraire")
	public isTimetable = t.option(t.boolean());

	@rename("estServiceGroupe")
	public isServiceGroup = t.option(t.boolean());
}

export class CategoryOrigin {
	@rename("G")
	public kind = t.enum(TypeOrigineCreationCategorieCahierDeTexte);
	@rename("L")
	public label = t.string();

	@rename("libelleIcone")
	public labelIcon = t.string();
}

export class HomeworkPointer extends Id {
	@rename("estDevoir")
	public isTest = t.option(t.boolean());

	@rename("originesCategorie")
	@deserializeWith(new TypeHttpElement(CategoryOrigin).array)
	public categories = t.array(t.reference(CategoryOrigin));
}

export class Course {
	@rename("N")
	public id = t.string();

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

	@rename("DateDuCoursFin")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public courseDateEnd = t.option(t.instance(Date));

	@rename("ListeContenus")
	@deserializeWith(new TypeHttpElement(Content).array)
	public content = t.array(t.reference(Content));

	@rename("cahierDeTextes")
	@deserializeWith(new TypeHttpElement(HomeworkPointer).single)
	public notebook = t.option(t.reference(HomeworkPointer));

	@rename("AvecTafPublie")
	public withHomeworkPublished = t.boolean();

	@rename("AvecCdT")
	public withNotebook = t.option(t.boolean());

	@rename("Statut")
	public status = t.option(t.string());

	@rename("estSortiePedagogique")
	public isFieldTrip = t.option(t.boolean());

	@rename("estRetenue")
	public isDetention = t.option(t.boolean());

	@rename("memo")
	public notes = t.option(t.string());

	@rename("estAnnule")
	public isCancelled = t.option(t.boolean());

	@rename("dispenseEleve")
	public studentExcused = t.option(t.boolean());

	@rename("accompagnateurs")
	public supervisors = t.option(t.array(t.string()));

	@rename("strGenreRess")
	public resourceTypeLabel = t.option(t.string());

	@rename("strRess")
	public resourceLabel = t.option(t.string());

	@rename("motif")
	public reason = t.option(t.string());
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
