import { Notes } from "~p0/api/homepage/response";
import { Actualities, AgendaList, Course } from "~p0/api/shared";
import { Parameters } from "~p0/models/params";
import { HomepageResponse } from "../../../api/homepage";

export class Homepage {
	public constructor(
		private parameters: Parameters,
		private _raw: HomepageResponse,
	) {}

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
