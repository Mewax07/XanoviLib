import { useMemo } from "react";
import { usePronote } from "../context/Pronote";

export const usePronoteConnected = () => {
	const { admin } = usePronote();

	return useMemo(() => {
		if (!admin) return null;

		// TODO: Show if timetable send good date.
		const now = new Date();
		const week = new Date();
		week.setDate(now.getDate() + 7);

		const homepage = async () => admin.getHomepage();
		const timetable = async () => admin.getTimetableFromIntervals(now, week);

		return { homepage, timetable };
	}, [admin]);
};
