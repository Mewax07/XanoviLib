interface WeekFrequency {
	label?: string;
	fortnight?: string;
}

interface Period {
	startDate: Date;
	endDate: Date;
}

interface CurrentWeekOptions {
	firstMonday: Date;
	weekFrequencies: Record<number, WeekFrequency> | Map<number, WeekFrequency>;
	firstDate: Date;
	lastDate: Date;
	periods: Period[];
	date?: Date;
}

export function getSchoolWeekNumber({
	firstMonday,
	weekFrequencies,
	firstDate,
	lastDate,
	periods,
	date = new Date(),
}: CurrentWeekOptions): number | null {
	const toYMD = (d: Date) => d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();

	const weeks: { start: Date; end: Date; number?: number }[] = [];
	const keys =
		weekFrequencies instanceof Map ? Array.from(weekFrequencies.keys()) : Object.keys(weekFrequencies).map(Number);
	const maxWeek = Math.max(...keys);

	for (let w = 0; w <= maxWeek; w++) {
		const weekInfo = weekFrequencies instanceof Map ? weekFrequencies.get(w) : weekFrequencies[w];

		const weekStart = new Date(firstMonday);
		weekStart.setUTCDate(firstMonday.getUTCDate() + w * 7);

		const weekEnd = new Date(weekStart);
		weekEnd.setUTCDate(weekStart.getUTCDate() + 4);

		const validPeriods = periods.filter(
			(period) =>
				(toYMD(weekStart) >= toYMD(period.startDate) && toYMD(weekEnd) <= toYMD(period.endDate)) ||
				(toYMD(weekStart) >= toYMD(period.startDate) && toYMD(weekStart) <= toYMD(period.endDate)) ||
				(toYMD(weekEnd) >= toYMD(period.startDate) && toYMD(weekEnd) <= toYMD(period.endDate)),
		);

		if (weekInfo || validPeriods.length > 0) {
			weeks.push({ start: weekStart, end: weekEnd });
		}
	}

	const filteredWeeks = weeks.filter(
		(w) =>
			(toYMD(w.start) >= toYMD(firstDate) && toYMD(w.end) <= toYMD(lastDate)) ||
			(toYMD(w.start) >= toYMD(firstDate) && toYMD(w.start) <= toYMD(lastDate)) ||
			(toYMD(w.end) >= toYMD(firstDate) && toYMD(w.end) <= toYMD(lastDate)),
	);

	filteredWeeks.forEach((w, i) => {
		w.number = i + 1;
	});

	const currentWeek = filteredWeeks.find((w) => toYMD(date) >= toYMD(w.start) && toYMD(date) <= toYMD(w.end));

	return currentWeek?.number ?? null;
}
