import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpElement } from "../http/TypeHttpElement";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { Absences, Content, Course, Id, Recess } from "../shared";

export class GridPreferences {
	@rename("genreRessource")
	public resourceType = t.number();
}

export class TimetableModel {
	@rename("jourCycleSelectionne")
	public selectedDayCycle = t.number();

	@rename("avecCoursAnnule")
	public withCanceledCourse = t.boolean();

	@rename("prefsGrille")
	public gridPrefs = t.reference(GridPreferences);

	@rename("ListeCours")
	public courses = t.array(t.reference(Course));

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
}
