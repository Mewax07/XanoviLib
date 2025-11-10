import { HomeworkResponse } from "../../api/homework";
import { _Homework } from "../../api/shared";

export class Homework {
	public constructor(private _raw: HomeworkResponse) {}

	public get homework(): _Homework[] {
		return this._raw.data.toDoList;
	}
}
