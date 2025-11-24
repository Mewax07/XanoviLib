import { HomeworkResponse } from "~p0/api/homework";
import { Parameters } from "~p0/models/params";
import { Child } from "~p0/models/user/parent";
import { Student } from "~p0/models/user/student";
import { User } from "~p0/models/user/user";
import { HomeworkAssignmentEntry } from "./HomeworkEntry";

export class Homework {
	public readonly entries: Array<HomeworkAssignmentEntry>;

	public constructor(
		private parameters: Parameters,
		private user: User,
		private readonly resource: Student | Child,
		private homework: HomeworkResponse,
	) {
		this.entries = homework.toDoList.data.homeworkList.map((assignment) => {
			return new HomeworkAssignmentEntry(parameters, user, resource, assignment);
		});

		this.entries.sort((a, b) => a.dueOn.getTime() - b.dueOn.getTime());
	}
}
