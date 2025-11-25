import { AssignmentAPI } from "~p0/api/assignment";
import { AssignmentDataStatus } from "~p0/api/assignment/request";
import {
	Content as HomeworkContent,
	_Homework as Homework_Content,
} from "~p0/api/homework/content_and_resource/content/response";
import { Resource as Homework_Resource } from "~p0/api/homework/content_and_resource/resource/response";
import { _Homework as Homework_ToDoList } from "~p0/api/homework/to_do_list/response";
import { HomeworkContentSubject, Content as HomeworkResourceContent } from "~p0/api/shared";
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

	public get task(): string {
		return this.assignment.descriptif;
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
		await new AssignmentAPI(this.user, this.resource).send({
			assignmentId: this.id,
			done: !this.isCompleted,
		} as AssignmentDataStatus);
		this.isCompleted = !this.isCompleted;
		return this.isCompleted;
	}

	public async setDone(done: boolean = true): Promise<boolean> {
		await new AssignmentAPI(this.user, this.resource).send({
			assignmentId: this.id,
			done: done,
		} as AssignmentDataStatus);
		this.isCompleted = done;
		return this.isCompleted;
	}
}

export class HomeowrkContentEntry {
	/** @internal */
	public constructor(
		protected readonly parameters: Parameters,
		protected readonly user: User,
		protected readonly resource: Student | Child,
		protected readonly assignment: Homework_Content,
	) {}

	public get id(): string {
		return this.assignment.id;
	}

	public get content(): Content[] {
		let contents = [];
		if (this.assignment.contentList) {
			for (let ctn of this.assignment.contentList) {
				contents.push(new Content(ctn));
			}
		}
		return contents;
	}
}

export class HomeowrkResourceEntry {
	/** @internal */
	public constructor(
		protected readonly parameters: Parameters,
		protected readonly user: User,
		protected readonly resource: Student | Child,
		protected readonly assignment: Homework_Resource,
	) {}

	public get date(): Date {
		return this.assignment.date;
	}

	public get resources(): Resource {
		return new Resource(this.assignment.resources);
	}

	public get subjectId(): string {
		return this.assignment.subject.id;
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

class Content {
	/** @internal */
	public constructor(private content: HomeworkContent) {}

	public get id() {
		return this.content.id;
	}

	public get attachments() {
		return this.content.unk_ListePieceJointe;
	}
}

class Resource {
	/** @internal */
	public constructor(private resource: HomeworkResourceContent) {}

	public get id() {
		return this.resource.id;
	}

	public get label() {
		return this.resource.label;
	}

	public get kind() {
		return this.resource.kind;
	}
}
