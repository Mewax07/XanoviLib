import { Actualities, AgendaList, Course, Notes } from "~p0/api/shared";
import { HomepageResponse } from "../../api/homepage";

export class Homepage {
	public constructor(private _raw: HomepageResponse) {}

	public get courses(): Course[] {
		return this._raw.data.courseList;
	}

	public get actualities(): Actualities | null {
		return this._raw.data.actualities;
	}

	public get agenda(): AgendaList {
		return this._raw.data.agenda;
	}

	public get notes(): Notes {
		return this._raw.data.notes;
	}
}
