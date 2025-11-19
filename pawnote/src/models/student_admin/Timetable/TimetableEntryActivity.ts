import { TimetableEntry } from "./TimetableEntry";

export class TimetableEntryActivity extends TimetableEntry {
	public get title(): string {
		return this.course.reason!;
	}

	public get attendants(): Array<string> {
		return this.course.supervisors!;
	}

	public get resourceTypeName(): string {
		return this.course.resourceTypeLabel!;
	}

	public get resourceValue(): string {
		return this.course.resourceLabel!;
	}
}
