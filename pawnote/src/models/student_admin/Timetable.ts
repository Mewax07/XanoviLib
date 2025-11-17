import { Course } from "../../api/shared";
import { TimetableResponse } from "../../api/timetable";

export class Timetable {
	public constructor(private _raw: TimetableResponse) {}

	public get courses(): Course[] {
		return this._raw.data.courses;
	}
}
