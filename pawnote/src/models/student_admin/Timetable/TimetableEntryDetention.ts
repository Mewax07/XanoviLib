import { TimetableEntry } from "./TimetableEntry";

export class TimetableEntryDetention extends TimetableEntry {
	public get title(): string | null {
		const value = this.course.content.find((contenu) => contenu.isTimetable);

		if (!value) return null;
		return value.label;
	}

	public get teachers(): Array<string> {
		return this.course.content.filter((contenu) => contenu.kind === 3).map((contenu) => contenu.label);
	}

	public get staff(): Array<string> {
		return this.course.content.filter((contenu) => contenu.kind === 34).map((contenu) => contenu.label);
	}

	public get rooms(): Array<string> {
		return this.course.content.filter((contenu) => contenu.kind === 17).map((contenu) => contenu.label);
	}
}
