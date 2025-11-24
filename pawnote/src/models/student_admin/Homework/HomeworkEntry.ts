import { AssignmentAPI } from "~p0/api/assignment";
import { _Homework as Homework_ToDoList } from "~p0/api/homework/to_do_list/response";
import { HomeworkContentSubject } from "~p0/api/shared";
import { Parameters } from "~p0/models/params";
import { Child } from "~p0/models/user/parent";
import { Student } from "~p0/models/user/student";
import { User } from "~p0/models/user/user";

export class HomeworkAssignmentEntry {
	/** @internal */
	public constructor(
		protected readonly parameters: Parameters,
		protected readonly user: User,
		protected readonly resource: Student | Child,
		protected readonly assignment: Homework_ToDoList,
	) {}

	public get id(): string {
		return this.assignment.id;
	}

	public get subject(): Subject {
		return new Subject(this.assignment.subject);
	}

	public get backgroundColor(): string {
		return this.assignment.backgroundColor;
	}

	public get blockLength(): number {
		return this.assignment.duringTime;
	}

	public get givenOn(): Date {
		return this.assignment.givenOn;
	}

	public get dueOn(): Date {
		return this.assignment.dueOn;
	}

	public get canComplete(): boolean {
		return this.assignment.canComplete ?? false;
	}

	public get isCompleted(): boolean {
		return this.assignment.done;
	}

	private set isCompleted(value: boolean) {
		this.assignment.done = value;
	}

	public get returnType() {
		return this.assignment.returnType;
	}

	public get difficultyLevel() {
		return this.assignment.difficultyLevel;
	}

	public get courseId(): string {
		return this.assignment.course!.id;
	}

	public async toggleDone(): Promise<boolean> {
		await new AssignmentAPI(this.user, this.resource).send(this.id, !this.isCompleted);
		this.isCompleted = !this.isCompleted;
		return this.isCompleted;
	}

	public async setDone(done: boolean = true): Promise<boolean> {
		await new AssignmentAPI(this.user, this.resource).send(this.id, done);
		this.isCompleted = done;
		return this.isCompleted;
	}
}

class Subject {
	/** @internal */
	public constructor(private subject: HomeworkContentSubject) {}

	public get id() {
		return this.subject.id;
	}

	public get label() {
		return this.subject.label;
	}
}

class Teacher {
	/** @internal */
	public constructor(private subject: HomeworkContentSubject) {}

	public get id() {
		return this.subject.id;
	}

	public get label() {
		return this.subject.label;
	}
}
