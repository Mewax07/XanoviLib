import { useMemo } from "react";
import { usePronote } from "../context/Pronote";

export const usePronoteConnected = () => {
	const { admin } = usePronote();

	return useMemo(() => {
		if (!admin) return null;

		// TODO: Show if timetable send good date.
		const now = new Date();
		const dayOfWeek = now.getDay();
		const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - daysToSubtract);
		startOfWeek.setHours(0, 0, 0, 0);

		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);
		endOfWeek.setHours(23, 59, 59, 999);

		const homepage = async () => admin.getHomepage();
		const timetable = async (startDate?: Date, endDate?: Date) =>
			admin.getTimetableFromIntervals(startDate ?? startOfWeek, endDate ?? endOfWeek);
		const homework = async (start?: number, end?: number) => admin.getHomeworkFromIntervals(start ?? 1, end ?? 52);

		return { homepage, timetable, homework };
	}, [admin]);
};
