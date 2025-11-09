import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpElement } from "../http/TypeHttpElement";
import { Absences, Actualities, AgendaList, Course, EducationalResource, Notes, Recess } from "../shared";

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

	public notes = t.reference(Notes);

	@rename("recreations")
	@deserializeWith(new TypeHttpElement(Recess).array)
	public recesses = t.array(t.reference(Recess));

	@rename("ressourcePedagogique")
	public educationalResource = t.reference(EducationalResource);
}
