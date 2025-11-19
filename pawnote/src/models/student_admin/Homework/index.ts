import { HomeworkResponse } from "~p0/api/homework";
import { _Homework } from "~p0/api/homework/response";
import { Parameters } from "~p0/models/params";

export class Homework {
	public constructor(
		private parameters: Parameters,
		private _raw: HomeworkResponse,
	) {}

	public get homework(): _Homework[] {
		return this._raw.data.toDoList;
	}
}
