import { defaultValue, deserializeWith, rename, t } from "~d0/index";
import { TypeHttpElement } from "../http/TypeHttpElement";
import { Onglet } from "../models/Onglet";

// First time implementing Student and Parent.
class UserAuthorizations {
	@rename("AvecDiscussion")
	@defaultValue(false)
	public canDiscuss = t.boolean();

	@rename("AvecDiscussionPersonnels")
	@defaultValue(false)
	public canDiscussWithStaff = t.boolean();

	@rename("AvecDiscussionProfesseurs")
	@defaultValue(false)
	public canDiscussWithTeachers = t.boolean();

	@rename("AvecDiscussionParents")
	@defaultValue(false)
	public canDiscussWithParents = t.boolean();

	@rename("AvecDiscussionEleves")
	@defaultValue(false)
	public canDiscussWithStudents = t.boolean();

	@rename("AvecDiscussionAvancee")
	@defaultValue(false)
	public hasAdvancedDiscussionEditor = t.boolean();

	@rename("AvecDeclarerDispenseLongue")
	@defaultValue(false)
	public canDeclareLongExemption = t.boolean();

	@rename("AvecDeclarerDispensePonctuelle")
	@defaultValue(false)
	public canDeclareOneTimeExemption = t.boolean();

	@rename("AvecDeclarerUneAbsence")
	@defaultValue(false)
	public canReportingAbsence = t.boolean();

	@rename("tailleMaxDocJointEtablissement")
	public maxAssignmentFileUploadSize = t.number();
}

class Etablissement {
	@rename("L")
	public name = t.string();

	@rename("N")
	public id = t.string();
}

export class Group {
	@rename("L")
	public name = t.string();

	@rename("N")
	public id = t.string();
}

export class Service {
	@rename("L")
	public name = t.string();

	@rename("N")
	public id = t.string();
}

class ClassInfo {
	@rename("L")
	public label = t.string();

	@rename("N")
	public id = t.string();
}

export class ClassHistoy {
	@rename("L")
	public name = t.string();

	@rename("N")
	public id = t.string();

	@rename("courant")
	public current = t.boolean();

	@rename("AvecNote")
	public withGrades = t.boolean();

	@rename("AvecFiliere")
	public withSector = t.boolean();
}

export class DefaultPeriod {
	@rename("L")
	public name = t.string();
	@rename("N")
	public id = t.string();
}

export class Period {
	@rename("L")
	public name = t.string();

	@rename("N")
	public id = t.option(t.string());

	@rename("G")
	public kind = t.number(); // TODO: find enum

	@rename("A")
	public active = t.option(t.boolean());

	@rename("GenreNotation")
	public grading = t.option(t.number());
}

export class UtilsNumber {
	// TODO
}

export class TabForPeriod {
	@rename("G")
	public tab = t.number();

	@rename("listePeriods")
	@deserializeWith(new TypeHttpElement(Period).array)
	public periods = t.array(t.reference(Period));

	@rename("periodeParDefaut")
	@deserializeWith(new TypeHttpElement(DefaultPeriod).single)
	public defaultPeriod = t.reference(DefaultPeriod);
}

export class Resources {
	@rename("L")
	public name = t.string();

	@rename("N")
	public id = t.string();

	@rename("G")
	public kind = t.number();

	@rename("P")
	public position = t.number();

	@rename("Etablissement")
	@deserializeWith(new TypeHttpElement(Etablissement).single)
	public school = t.reference(Etablissement);

	@rename("listeGroupes")
	@deserializeWith(new TypeHttpElement(Group).array)
	public groups = t.array(t.reference(Group));

	@rename("listeOngletsPourPeriodes")
	@deserializeWith(new TypeHttpElement(TabForPeriod).array)
	tabsListForPeriod = t.array(t.reference(TabForPeriod));

	@deserializeWith(new TypeHttpElement(UtilsNumber).array)
	listeNumerosUtiles = t.array(t.reference(UtilsNumber));

	@rename("classeDEleve")
	public classInfo = t.option(t.reference(ClassInfo));

	@rename("avecPhoto")
	public withProfilePicture = t.boolean();

	@rename("estDelegue")
	@defaultValue(false)
	public isDelegate = t.boolean();

	@rename("estDirecteur")
	@defaultValue(false)
	public isDirector = t.boolean();

	@rename("estMembreCA")
	@defaultValue(false)
	public isMemberCA = t.boolean();

	@deserializeWith(new TypeHttpElement(TabForPeriod).array)
	listeOngletsPourPeriodes = t.array(t.reference(TabForPeriod));
}

export class Notification {
	@rename("compteurCentraleNotif")
	centralNotifCount = t.number();
}

export class NotificationCommunication {
	@rename("onglet")
	tab = t.number();

	@rename("nb")
	count = t.number();
}

export class UserSettingModel {
	@rename("autorisations")
	public authorizations = t.reference(UserAuthorizations);

	@rename("listeOnglets")
	public tabs = t.array(t.reference(Onglet));

	@rename("ressource")
	public resources = t.reference(Resources);
}

export class UserSettingSignature {
	public notifications = t.array(t.reference(Notification));

	public notificationsCommunication = t.array(t.reference(NotificationCommunication));

	public actualisationMessage = t.boolean();
}
