import { Course } from "~p0/api/shared";
import { Parameters } from "~p0/models/params";

export class TimetableEntry {
	/** @internal */
	public constructor(
		protected readonly parameters: Parameters,
		protected readonly course: Course,
	) {}

	public get id(): string {
		return this.course.id;
	}

	public get backgroundColor(): string | null {
		return this.course.backgroundColor;
	}

	public get startDate(): Date {
		return this.course.courseDate;
	}

	public get endDate(): Date {
		if (this.course.courseDateEnd) {
			return this.course.courseDateEnd;
		} else {
			let position = (this.blockPosition % this.parameters.slotsPerDay) + this.blockLength - 1;

			if (position > this.parameters.endings.length) {
				position %= this.parameters.endings.length - 1;
			}

			const formatted = this.parameters.endings[position];
			const [hours, minutes] = formatted.split("h").map(Number);

			const endDate = new Date(this.startDate);
			endDate.setHours(hours, minutes);

			return endDate;
		}
	}

	public get blockLength(): number {
		return this.course.duringTime;
	}

	public get blockPosition(): number {
		return this.course.start;
	}

	public get notes(): string | null {
		return this.course.notes;
	}

	public get weekNumber(): number {
		return this.parameters.dateToWeekNumber(this.startDate);
	}
}
