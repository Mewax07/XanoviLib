import { defaultValue, rename, t } from "~d0/index";
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

class ClassInfo {
	@rename("L")
	public label = t.string();

	@rename("N")
	public id = t.string();
}

export class Resources {
	@rename("L")
	public name = t.string();

	@rename("N")
	public id = t.string();

	@rename("G")
	public kind = t.number();

	@rename("avecPhoto")
	public withProfilePicture = t.boolean();

	@rename("classeDEleve")
	public classInfo = t.option(t.reference(ClassInfo));

	@rename("estDelegue")
	@defaultValue(false)
	public isDelegate = t.boolean();

	@rename("estDirecteur")
	@defaultValue(false)
	public isDirector = t.boolean();

	@rename("estMembreCA")
	@defaultValue(false)
	public isMemberCA = t.boolean();
}

export class UserSettingModel {
	@rename("autorisations")
	public authorizations = t.reference(UserAuthorizations);

	@rename("listeOnglets")
	public tabs = t.array(t.reference(Onglet));

	@rename("ressource")
	public resources = t.reference(Resources);
}
