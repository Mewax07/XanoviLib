import { GlobalContext } from "./Context";

export class ClassDate {
	static milliseconds = 1;
	static seconds = 1000 * ClassDate.milliseconds;
	static minutes = 60 * ClassDate.seconds;
	static hours = 60 * ClassDate.minutes;
	static days = 24 * ClassDate.hours;
	static week = 7 * ClassDate.days;

	static today(): Date {
		return new Date();
	}

	static tomorrow(): Date {
		const d = new Date();
		d.setDate(d.getDate() + 1);
		return d;
	}

	static yesterday(): Date {
		const d = new Date();
		d.setDate(d.getDate() - 1);
		return d;
	}

	static isSameDay(a: Date, b: Date): boolean {
		return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
	}

	static getWeekNumber(date: Date): number {
		const targetDate = date || new Date();
		const cycle = GlobalContext.globalCycle;

		if (!cycle.firstDate || !cycle.datesPerCycle.length) return 0;

		let totalDays = 0;

		for (let c = 1; c < cycle.datesPerCycle.length; c++) {
			const days = cycle.datesPerCycle[c];
			for (const d of days) {
				if (d > targetDate) {
					return Math.floor(totalDays / cycle.daysWorkedByCycle) + 1;
				}
				totalDays++;
			}
		}

		return Math.floor(totalDays / cycle.daysWorkedByCycle) + 1;
	}

	static daysBetween(startDate: Date, endDate: Date): number {
		const startUTC = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
		const endUTC = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
		return Math.floor((endUTC - startUTC) / this.days);
	}
}
