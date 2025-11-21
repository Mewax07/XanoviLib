import { HomeworkResponse } from "~p0/api/homework";
import { _Homework } from "~p0/api/homework/to_do_list/response";
import { Parameters } from "~p0/models/params";

export class Homework {
	public constructor(
		private parameters: Parameters,
		private _raw: HomeworkResponse,
	) {}
}
