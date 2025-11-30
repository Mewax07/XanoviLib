import { HomeworkAPI } from "~p0/api/homework";
import { AttachmentKind } from "~p0/api/models/attachment";
import { Presence } from "~p0/api/presence";
import { translateToWeekNumber } from "~p0/core";
import { HomepageAPI } from "../../api/homepage";
import { TimetableAPI } from "../../api/timetable";
import { Child } from "../user/parent";
import { Student } from "../user/student";
import { User } from "../user/user";
import { Homepage } from "./Homepage";
import { Homework } from "./Homework";
import { Timetable } from "./Timetable";

export interface Attachment {
	id: string;
	label: string;
	kind: number;
	url?: string | URL;
}

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
		return new Homepage(this._user.parameters, await new HomepageAPI(this._user).send(week));
	}

	public async getTimetableFromIntervals(start: Date, end?: Date): Promise<Timetable> {
		return new Timetable(
			this._user.parameters,
			await new TimetableAPI(this._user, this._resource).sendIntervals(start, end),
		);
	}

	public async getTimetableFromWeek(week?: number): Promise<Timetable> {
		return new Timetable(
			this._user.parameters,
			await new TimetableAPI(this._user, this._resource).sendWeekNumber(week),
		);
	}

	public async getHomeworkFromIntervals(start?: number, end?: number): Promise<Homework> {
		return new Homework(
			this._user.parameters,
			this._user,
			this._resource,
			await new HomeworkAPI(this._user, this._resource).sendIntervals(start, end),
		);
	}

	public async getHomeworkSinceDate(date?: Date): Promise<Homework> {
		return new Homework(
			this._user.parameters,
			this._user,
			this._resource,
			await new HomeworkAPI(this._user, this._resource).sendSinceDate(date),
		);
	}

	public startPresenceInterval(interval: number = 2 * 60 * 1000) {
		this.clearPresenceInterval();
		this._user.session.presence = setInterval(() => new Presence(this._user, this._resource).send(), interval);
	}

	public clearPresenceInterval() {
		if (this._user.session.presence) {
			clearInterval(this._user.session.presence);
			this._user.session.presence = null;
		}
	}

	public getInfos(attachment: Attachment, parameters = {}) {
		const { id, label, kind } = attachment;
		let url: string;

		if (kind === AttachmentKind.Link) {
			url = attachment.url!.toString() ?? label;
		} else {
			const data = JSON.stringify({
				N: id,
				Actif: true,

				...parameters,
			});

			const encryptedBytes = this._user.session.aes.encrypt(data);
			const encrypted = Array.from(encryptedBytes)
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");
			url = `${this._user.session.url}/FichiersExternes/${encrypted}/${encodeURIComponent(label)}?Session=${this._user.session.homepage.id}`;
		}

		return {
			kind,
			id,
			label,
			url,
		};
	}

	public getWeekNumberSinceDate(date: Date) {
		return translateToWeekNumber(date, this._user.parameters.firstDate);
	}
}

export * from "./Homepage";
export * from "./Homework";
export * from "./Timetable";
