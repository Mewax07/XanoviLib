import { HomeworkResponse } from "~p0/api/homework";
import { Parameters } from "~p0/models/params";

export class Homework {
	public constructor(
		private parameters: Parameters,
		public _raw: HomeworkResponse,
	) {}
}
