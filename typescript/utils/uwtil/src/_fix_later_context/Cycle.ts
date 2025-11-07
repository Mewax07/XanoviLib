import { TypeHttpEnsembleNombre } from "~p0/api/http/TypeHttpEnsembleNombre";
import { ClassDate } from "./Date";

export type CycleBounds = {
	start: Date;
	end: Date;
};

export class CycleObject {
	firstDate: Date | null = null;
	lastDate: Date | null = null;
	daysWorkedByCycle: number = 0;
	holidays: TypeHttpEnsembleNombre = new TypeHttpEnsembleNombre();
	openDays: number[] = [];
	datesPerCycle: Date[][] = [];
	cycleBounds: CycleBounds[] = [];

	init(params: Partial<CycleObject>) {
		Object.assign(this, params);
		this.calculateCycles();
	}

	private calculateCycles() {
		if (!this.firstDate || !this.lastDate || this.daysWorkedByCycle <= 0 || this.openDays.length === 0) return;

		let currentDate = new Date(this.firstDate);
		let currentCycle = 1;
		this.datesPerCycle[currentCycle] = [];
		this.cycleBounds[currentCycle] = { start: new Date(currentDate), end: new Date(currentDate) };

		while (currentDate <= this.lastDate) {
			const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
			const isOpenDay = this.openDays.includes(dayOfWeek);
			const isHoliday = this.isHolidayDate(currentDate);

			if (isOpenDay && !isHoliday) {
				const dayIndex = this.datesPerCycle[currentCycle].length;
				this.datesPerCycle[currentCycle][dayIndex] = new Date(currentDate);

				if (!this.cycleBounds[currentCycle]) {
					this.cycleBounds[currentCycle] = { start: new Date(currentDate), end: new Date(currentDate) };
				}
				this.cycleBounds[currentCycle].end = new Date(currentDate);

				if (dayIndex + 1 >= this.daysWorkedByCycle) {
					currentCycle++;
					this.datesPerCycle[currentCycle] = [];
				}
			}

			currentDate.setDate(currentDate.getDate() + 1);
		}
	}

	getCurrentCycle(): number {
		return this.getCycleByDate(new Date());
	}

	getCycleByDate(date: Date): number {
		for (let i = 1; i < this.cycleBounds.length; i++) {
			const bounds = this.cycleBounds[i];
			if (!bounds) continue;
			if (date >= bounds.start && date <= bounds.end) return i;
		}
		return -1;
	}

	getDayInCycle(date: Date): number {
		const cycle = this.getCycleByDate(date);
		if (cycle < 1) return -1;
		const index = this.datesPerCycle[cycle].findIndex((d) => ClassDate.isSameDay(d, date));
		return index;
	}

	getCycleStartDate(cycle: number): Date | null {
		return this.cycleBounds[cycle]?.start || null;
	}

	getCycleEndDate(cycle: number): Date | null {
		return this.cycleBounds[cycle]?.end || null;
	}

	isHolidayDate(date: Date): boolean {
		if (!this.holidays) return false;
		const dayAnnual = ClassDate.daysBetween(this.firstDate!, date);
		return this.holidays.contains(dayAnnual + 1);
	}
}
