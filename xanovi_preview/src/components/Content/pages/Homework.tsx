import { useEffect, useState } from "react";
import { usePronoteConnected } from "../../../api/homepage";

import { ONE_HOUR } from "..";
import { loadHomework, saveHomework } from "../../../cache/homeworkCache";
import Xanovi from "../../../lib/xanovi_lib";
import { hexToHSL } from "../../../utils/style";
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
	backgroundColor: string;
}

interface WeekData {
	days: [string, HomeworkItem[]][];
}

function switchMatterName(name: string): string {
	return name
		.split(" ")
		.map((str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
		.join(" ");
}

function convertLinks(text: string) {
	return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
}

function backgroundToHSL(hex: string) {
	const hsl = hexToHSL(hex);
	const accent = hsl.split("hsl(")[1].split(",")[0];
	return {
		accent,
		light: "80%",
		opacity: "0.5",
	};
}

function groupDaysByWeek(homeworksGrouped: Record<string, HomeworkItem[]>): WeekData[] {
	const sortedDays = Object.keys(homeworksGrouped).sort();
	const weekDays = sortedDays.slice(0, 21);

	const weeks: WeekData[] = [];
	const daysArray = weekDays.map((day) => [day, homeworksGrouped[day]] as [string, HomeworkItem[]]);

	for (let i = 0; i < 3; i++) {
		const start = i * 7;
		const end = start + 7;
		weeks.push({
			days: daysArray.slice(start, end),
		});
	}
	return weeks;
}

export const Work = () => {
	const pronote = usePronoteConnected();

	const [_, setHomeworks] = useState<Record<string, HomeworkItem[]>>({});
	const [weeksData, setWeeksData] = useState<WeekData[]>([]);

	useEffect(() => {
		if (!pronote) return;

		const processData = (homeworkInfo: InstanceType<typeof pawnote.Homework>) => {
			const grouped: Record<string, HomeworkItem[]> = {};

			for (const hw of homeworkInfo.entries) {
				const dateObj = new Date(hw.assignment.dueOn);
				const dayKey = dateObj.toISOString().split("T")[0];

				if (!grouped[dayKey]) grouped[dayKey] = [];

				grouped[dayKey].push({
					subject: {
						id: hw.assignment.subject.id,
						name: hw.assignment.subject.label,
					},
					description: hw.assignment.task,
					givenDate: hw.assignment.givenOn,
					dueDate: hw.assignment.dueOn,
					completed: hw.assignment.isCompleted,
					backgroundColor: hw.assignment.backgroundColor,
				});
			}

			for (const day in grouped) {
				grouped[day].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
			}

			return grouped;
		};

		const loadData = async () => {
			const cache = await loadHomework<Record<string, HomeworkItem[]>>();
			let groupedHomeworks: Record<string, HomeworkItem[]> = {};

			const hasInternet = navigator.onLine;

			if (cache && Date.now() - cache.savedAt < ONE_HOUR) {
				console.log("Using cached homework");
				groupedHomeworks = cache.data;
			} else if (!hasInternet && cache) {
				console.log("No internet, using old cache");
				groupedHomeworks = cache.data;
			} else {
				try {
					console.log("Fetching new Homework...");
					const homeworkInfo = await pronote.homework();
					groupedHomeworks = processData(homeworkInfo);
					await saveHomework(groupedHomeworks);
				} catch (err) {
					console.error("Fetch error:", err);
					if (cache) {
						console.log("Falling back to cache...");
						groupedHomeworks = cache.data;
					}
				}
			}

			setHomeworks(groupedHomeworks);
			setWeeksData(groupDaysByWeek(groupedHomeworks));
		};

		loadData();
	}, [pronote]);

	return (
		<div className="work-weeks-container" style={{ display: "flex", gap: "20px", overflowX: "auto" }}>
			{weeksData.map((week, weekIndex) => (
				<div key={weekIndex} className="week-content" style={{ minWidth: "300px", flex: "1 1 30%" }}>
					<h3>
						Semaine {weekIndex + 1} ({week.days.length} jours)
					</h3>
					<div className="days-scroll">
						{week.days.map(([day, items]) => {
							const formattedDate = new Date(day).toLocaleDateString("fr-FR", {
								weekday: "long",
								day: "numeric",
								month: "long",
							});

							return (
								<div key={day} className="content">
									<p className="title">Le {formattedDate}</p>

									{items.map((hw, idx) => {
										const correctedName = switchMatterName(hw.subject.name);
										const color = backgroundToHSL(hw.backgroundColor);

										return (
											<div
												key={idx}
												className="content card"
												style={
													{
														"--_-bf-accent": color.accent,
														"--_-bf-light": color.light,
														"--_-bf-opacity": color.opacity,
														"--_-af-accent": color.accent,
														"--_-af-light": "45%",
														"--_-af-opacity": "0.9",
													} as React.CSSProperties
												}
											>
												<div
													className="check"
													onClick={() => {
														console.log("toggle", hw);
													}}
												>
													<i
														className={`fa-regular ${
															hw.completed ? "fa-circle-check" : "fa-circle-dashed"
														}`}
													/>
												</div>

												<div className="info">
													<p className="matter">{correctedName}</p>
													<p
														className="context"
														dangerouslySetInnerHTML={{
															__html: convertLinks(hw.description),
														}}
													/>
												</div>

												<div className="ai-button" onClick={() => console.log("AI btn:", hw)}>
													<i className="fa-regular fa-microchip-ai" />
												</div>
											</div>
										);
									})}
								</div>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
};

export default Work;
