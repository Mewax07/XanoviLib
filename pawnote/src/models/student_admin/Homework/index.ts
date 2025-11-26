import { HomeworkResponse } from "~p0/api/homework";
import { Parameters } from "~p0/models/params";
import { Child } from "~p0/models/user/parent";
import { Student } from "~p0/models/user/student";
import { User } from "~p0/models/user/user";
import { HomeworkEntry } from "./HomeworkEntry";

export class Homework {
	public readonly entries: Array<HomeworkEntry>;

	public constructor(
		private parameters: Parameters,
		private user: User,
		private readonly resource: Student | Child,
		private homework: HomeworkResponse,
	) {
		this.entries = this.homework.toDoList.data.homeworkList.map((assignment) => {
			const content = this.homework.content.data.homeworkList.find((c) => c.id === assignment.id);

			const resource = this.homework.resource.data.resourcesList.listResources.find((r) => r.subject.id === assignment.id);

			return new HomeworkEntry(
				this.parameters,
				this.user,
				this.resource,
				assignment,
				content!,
				resource!,
			);
		});

		this.entries.sort((a, b) => a.assignment.dueOn.getTime() - b.assignment.dueOn.getTime());
	}
}
