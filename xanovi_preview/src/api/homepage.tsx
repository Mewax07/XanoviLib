import { useMemo } from "react";
import { usePronote } from "../context/Pronote";

export const usePronoteConnected = () => {
	const { admin } = usePronote();

	return useMemo(() => {
		if (!admin) return null;

		const homepage = async () => admin.getHomepage();
		const timetable = async () => admin.getTimetableFromWeek(0);

		return { homepage, timetable };
	}, [admin]);
};
