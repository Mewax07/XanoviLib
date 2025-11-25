import { useEffect, useState } from "react";
import { usePronoteConnected } from "../../../api/homepage";

import { ONE_HOUR } from "..";
import { loadHomework, saveHomework } from "../../../cache/homeworkCache";
import Xanovi from "../../../lib/xanovi_lib";
const pawnote = Xanovi.pronote;

interface HomeworkItem {
	subject: {
		id: string;
		name: string;
	};
	description: string;
	givenDate: Date;
	dueDate: Date;
	completed: boolean;
}

export const Work = () => {
	const pronote = usePronoteConnected();

	const [homeworks, setHomeworks] = useState<Record<string, HomeworkItem[]>>({});

	useEffect(() => {
		if (!pronote) return;

		const processData = (homeworkInfo: InstanceType<typeof pawnote.Homework>) => {
			const grouped: Record<string, HomeworkItem[]> = {};

			for (const hw of homeworkInfo.entries) {
				const dateObj = new Date(hw.dueOn);
				const dayKey = dateObj.toISOString().split("T")[0];

				if (!grouped[dayKey]) grouped[dayKey] = [];

				grouped[dayKey].push({
					subject: {
						id: hw.subject.id,
						name: hw.subject.label,
					},
					description: hw.task,
					givenDate: hw.givenOn,
					dueDate: hw.dueOn,
					completed: hw.isCompleted,
				});
			}

			for (const day in grouped) {
				grouped[day].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
			}

			const sortedDays = Object.keys(grouped).sort();
			const weekDays = sortedDays.slice(0, 21);

			const limitedGrouped: Record<string, HomeworkItem[]> = {};
			weekDays.forEach((day) => {
				limitedGrouped[day] = grouped[day];
			});

			return limitedGrouped;
		};

		const loadData = async () => {
			const cache = await loadHomework<Record<string, HomeworkItem[]>>();

			const hasInternet = navigator.onLine;

			if (cache && Date.now() - cache.savedAt < ONE_HOUR) {
				console.log("Using cached homework");
				setHomeworks(cache.data);
				return;
			}

			if (!hasInternet && cache) {
				console.log("No internet, using old cache");
				setHomeworks(cache.data);
				return;
			}

			try {
				console.log("Fetching new Homework...");
				const homeworkInfo = await pronote.homework();
				console.log(homeworkInfo);

				const grouped = processData(homeworkInfo);

				setHomeworks(grouped);
				await saveHomework(grouped);
			} catch (err) {
				console.error("Fetch error:", err);

				if (cache) {
					console.log("Falling back to cache...");
					setHomeworks(cache.data);
				}
			}
		};

		loadData();
	}, [pronote]);

	return (
		<div>
			{Object.entries(homeworks).map(([day, items]) => (
				<div key={day}>
					<h3>{day}</h3>
					<ul>
						{items.map((hw, idx) => (
							<li key={idx}>
								<strong>{hw.subject.name}:</strong> {hw.description}{" "}
								{hw.completed ? "(Done)" : "(Pending)"}
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default Work;
