import { defaultValue, deserializeWith, rename, t } from "~d0/index";
import { TypeHttpElement } from "../http/TypeHttpElement";
import { Onglet } from "../models/onglet";

export class ParametresUtilisateurEDT {
	@rename("afficherCoursAnnules")
	public showCancelledClasses = t.boolean();

	@rename("axeInverseEDT")
	public invertEDTAxis = t.boolean();

	@rename("axeInversePlanningHebdo")
	public invertWeeklyPlanningAxis = t.boolean();

	@rename("axeInversePlanningJour")
	public invertDailyPlanningAxis = t.boolean();

	@rename("axeInversePlanningJour2")
	public invertDailyPlanningAxisAlt = t.boolean();

	@rename("nbJours")
	public daysCount = t.number();

	@rename("nbRessources")
	public resourcesCount = t.number();

	@rename("nbJoursEDT")
	public edtDaysCount = t.number();

	@rename("nbSequences")
	public sequencesCount = t.number();
}

export class ParametresUtilisateurCommunication {
	@rename("DiscussionNonLues")
	public unreadDiscussions = t.boolean();
}

export class ParametresUtilisateur {
	@rename("version")
	public version = t.number();

	@rename("EDT")
	public timetable = t.reference(ParametresUtilisateurEDT);

	@rename("Communication")
	public communication = t.reference(ParametresUtilisateurCommunication);
}

export class InformationEtablissementCoordonnees {
	@rename("Adresse1")
	public addressLine1 = t.string();

	@rename("Adresse2")
	public addressLine2 = t.string();

	@rename("Adresse3")
	public addressLine3 = t.string();

	@rename("Adresse4")
	public addressLine4 = t.string();

	@rename("CodePostal")
	public postalCode = t.string();

	@rename("LibellePostal")
	public postalLabel = t.string();

	@rename("LibelleVille")
	public cityName = t.string();

	@rename("Province")
	public province = t.string();

	@rename("Pays")
	public country = t.string();

	@rename("SiteInternet")
	public website = t.string();
}

export class InformationEtablissement {
	@rename("L")
	public name = t.string();

	@rename("N")
	public id = t.string();

	@rename("Coordonnees")
	public coordinates = t.reference(InformationEtablissementCoordonnees);

	@rename("avecInformations")
	public hasInformation = t.boolean();
}

export class AutorisationsSessionFonctionnalites {
	@rename("gestionTwitter")
	public twitterManagement = t.boolean();

	@rename("attestationEtendue")
	public extendedCertificate = t.boolean();

	@rename("gestionARBulletins")
	public reportAcknowledgementManagement = t.boolean();
}

export class AutorisationsSession {
	@rename("fonctionnalites")
	public features = t.reference(AutorisationsSessionFonctionnalites);
}

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

export class MotifAbsence {
	@rename("L")
	public name = t.string();

	@rename("N")
	public id = t.string();
}

export class MotifRetard {
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
	// TODO: Add feature
}

export class TabForPeriod {
	@rename("G")
	public tab = t.number();

	@rename("listePeriodes")
	@deserializeWith(new TypeHttpElement(Period).array)
	public periods = t.array(t.reference(Period));

	@rename("periodeParDefaut")
	@deserializeWith(new TypeHttpElement(DefaultPeriod).single)
	public defaultPeriod = t.reference(DefaultPeriod);
}

export class InnerResource {
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

	@rename("classeDEleve")
	public classInfo = t.reference(ClassInfo);

	@rename("listeClassesHistoriques")
	@deserializeWith(new TypeHttpElement(Etablissement).array)
	public studentClassesHistory = t.array(t.reference(Etablissement));

	@rename("listeGroupes")
	@deserializeWith(new TypeHttpElement(Group).array)
	public groups = t.array(t.reference(Group));

	@deserializeWith(new TypeHttpElement(TabForPeriod).array)
	public listeOngletsPourPeriodes = t.array(t.reference(TabForPeriod));
}

export class Resources {
	@rename("L")
	public name = t.string();

	@rename("N")
	public id = t.string();

	@rename("G")
	public kind = t.number();

	@rename("P")
	public position = t.option(t.number());

	@rename("listeRessources")
	public inner = t.option(t.array(t.reference(InnerResource)));

	@rename("Etablissement")
	@deserializeWith(new TypeHttpElement(Etablissement).single)
	public school = t.option(t.reference(Etablissement));

	@rename("listeGroupes")
	@deserializeWith(new TypeHttpElement(Group).array)
	public groups = t.option(t.array(t.reference(Group)));

	@rename("listeOngletsPourPeriodes")
	@deserializeWith(new TypeHttpElement(TabForPeriod).array)
	tabsListForPeriod = t.option(t.array(t.reference(TabForPeriod)));

	@deserializeWith(new TypeHttpElement(UtilsNumber).array)
	listeNumerosUtiles = t.option(t.array(t.reference(UtilsNumber)));

	@rename("classeDEleve")
	public classInfo = t.option(t.reference(ClassInfo));

	@rename("listeClassesHistoriques")
	@deserializeWith(new TypeHttpElement(Etablissement).array)
	public studentClassesHistory = t.option(t.array(t.reference(Etablissement)));

	@rename("avecPhoto")
	public withProfilePicture = t.option(t.boolean());

	@rename("estDelegue")
	@defaultValue(false)
	public isDelegate = t.option(t.boolean());

	@rename("estDirecteur")
	@defaultValue(false)
	public isDirector = t.option(t.boolean());

	@rename("estMembreCA")
	@defaultValue(false)
	public isMemberCA = t.option(t.boolean());
}

export class Notification {
	compteurCentraleNotif = t.number();
}

export class NotificationCommunication {
	@rename("onglet")
	tab = t.number();

	@rename("nb")
	count = t.number();
}

export class UserSettingModel {
	@rename("ressource")
	public resources = t.reference(Resources);

	@deserializeWith(new TypeHttpElement(InformationEtablissement).array)
	public listeInformationsEtablissements = t.array(t.reference(InformationEtablissement));

	@rename("autorisations")
	public authorizations = t.reference(UserAuthorizations);

	@rename("autorisationsSession")
	public authorizationsSession = t.reference(AutorisationsSession);

	@deserializeWith(new TypeHttpElement(MotifAbsence).array)
	public listeMotifsAbsences = t.option(t.array(t.reference(MotifAbsence)));

	@deserializeWith(new TypeHttpElement(MotifRetard).array)
	public listeMotifsRetards = t.option(t.array(t.reference(MotifRetard)));

	public parametresUtilisateur = t.reference(ParametresUtilisateur);

	public listeOnglets = t.array(t.reference(Onglet));
	public listeOngletsInvisibles = t.array(t.number());
	public listeOngletsNotification = t.array(t.number());
}

export class UserSettingSignature {
	public notifications = t.reference(Notification);

	public notificationsCommunication = t.array(t.reference(NotificationCommunication));

	public actualisationMessage = t.boolean();
}
