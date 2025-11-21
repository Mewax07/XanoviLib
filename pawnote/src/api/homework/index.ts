import { Child, Student, User } from "~p0/models";
import { Homework_89_Content_API, HomeworkResponse as HomeworkResponse_Content } from "./content_and_resource/content";
import { Homework_88_API, HomeworkResponse as HomeworkResponse_ToDoList } from "./to_do_list";

export type HomeworkResponse = {
	toDoList: HomeworkResponse_ToDoList;
	content: HomeworkResponse_Content;
};

export class HomeworkAPI {
	constructor(
		private readonly user: User,
		private readonly resource: Student | Child,
	) {}

	public async sendIntervals(startDate?: number, endDate?: number): Promise<HomeworkResponse> {
		const homework_to_do_list = await new Homework_88_API(this.user, this.resource).sendIntervals(
			startDate,
			endDate,
		);
		const homework_content = await new Homework_89_Content_API(this.user, this.resource).sendIntervals(
			startDate,
			endDate,
		);

		return {
			toDoList: homework_to_do_list,
			content: homework_content,
		};
	}

	public async sendSinceDate(date?: Date): Promise<HomeworkResponse> {
		const homework_to_do_list = await new Homework_88_API(this.user, this.resource).sendSinceDate(date);

		return {
			toDoList: homework_to_do_list,
			content: undefined as any,
		};
	}
}
