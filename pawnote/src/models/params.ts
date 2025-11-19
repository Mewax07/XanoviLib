import { Periode } from "~p0/api";
import { FunctionParametersResponse } from "~p0/api/function";
import { JoursFeries } from "~p0/api/models/feries";
import { getTimeUTC } from "~p0/core/date";

export class Parameters {
	/** @internal */
	public constructor(private readonly parameters: FunctionParametersResponse) {}

	public get navigatorIdentifier(): string | null {
		return this.parameters.data.navigatorIdentifier;
	}

	public get slotsPerDay(): number {
		return this.parameters.data.general.slotsPerDay;
	}

	public get nextBusinessDay(): Date {
		return this.parameters.data.general.openingDate;
	}

	public get firstMonday(): Date {
		return this.parameters.data.general.firstMondayDate;
	}

	public get firstDate(): Date {
		return this.parameters.data.general.firstDate;
	}

	public get lastDate(): Date {
		return this.parameters.data.general.lastDate;
	}

	public get endings(): Array<string> {
		return this.parameters.data.general.endingHours.map((heure) => heure.label);
	}

	public get periods(): Array<Period> {
		return this.parameters.data.general.periods.map((periode) => new Period(periode));
	}

	public get holidays(): Array<Holiday> {
		return this.parameters.data.general.listHolidays.map((ferie) => new Holiday(ferie));
	}

	public get weekFrequencies(): Map<number, WeekFrequency> {
		const frequencies = new Map();

		for (const frequency of [1, 2]) {
			const weeks = this.parameters.data.general.frequenciesDomains[frequency];
			for (const week of weeks) {
				frequencies.set(week, new WeekFrequency(this.parameters, frequency));
			}
		}

		return frequencies;
	}

	public dateToWeekNumber(date: Date): number {
		const diff = Math.floor((getTimeUTC(date) - getTimeUTC(this.firstMonday)) / (1000 * 60 * 60 * 24));
		return 1 + Math.floor(diff / 7);
	}
}

export class WeekFrequency {
	public label: string;

	/** @internal */
	public constructor(
		parameters: FunctionParametersResponse,
		public readonly frequency: number,
	) {
		this.label = parameters.data.general.frequenciesLabels[frequency];
	}
}

export class Holiday {
	public id: string;
	public name: string;
	public startDate: Date;
	public endDate: Date;

	public constructor(ferie: JoursFeries) {
		this.id = ferie.id;
		this.name = ferie.label;
		this.startDate = ferie.startDate;
		this.endDate = ferie.endDate;
	}
}

export class Period {
	public constructor(private readonly periode: Periode) {}

	public get id() {
		return this.periode.id;
	}
	public get kind() {
		return this.periode.kind;
	}
	public get name() {
		return this.periode.label;
	}
	public get startDate(): Date {
		return this.periode.startDate;
	}
	public get endDate(): Date {
		return this.periode.endDate;
	}
}
