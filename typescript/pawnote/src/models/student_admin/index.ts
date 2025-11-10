import { Timetable as TimetableAPI } from "../../api/timetable";
import { Homepage as HomepageAPI } from "../../api/homepage";
import { Homework as HomeworkAPI } from "../../api/homework";
import { Child } from "../user/parent";
import { Student } from "../user/student";
import { User } from "../user/user";
import { Homepage } from "./Homepage";
import { Timetable } from "./Timetable";
import { Homework } from "./Homework";

export class StudentAdministration {
	/** @internal */
	public constructor(
		private readonly _user: User,
		private readonly _sub?: Child,
	) {}

	private get _resource(): Student | Child {
		if (this._user instanceof Student) return this._user;
		else return this._sub!;
	}

	public async getHomepage(week?: number): Promise<Homepage> {
		return new Homepage(await new HomepageAPI(this._user).send(week));
	}

	public async getTimetableFromIntervals(start: Date, end?: Date): Promise<Timetable> {
		return new Timetable(await new TimetableAPI(this._user, this._resource).sendIntervals(start, end));
	}

	public async getTimetableFromWeek(week?: number): Promise<Timetable> {
		return new Timetable(await new TimetableAPI(this._user, this._resource).sendWeekNumber(week));
	}

	public async getHomeworkFromIntervals(start?: number, end?: number): Promise<Homework> {
		return new Homework(await new HomeworkAPI(this._user, this._resource).sendIntervals(start, end));
	}

	public async getHomeworkSinceDate(date?: Date): Promise<Homework> {
		return new Homework(await new HomeworkAPI(this._user, this._resource).sendSinceDate(date));
	}
}
