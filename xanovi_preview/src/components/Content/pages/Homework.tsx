import { useEffect, useState } from "react";
import { usePronoteConnected } from "../../../api/homepage";

import { ONE_HOUR } from "..";
import { loadHomework, saveHomework } from "../../../cache/homeworkCache";
import Xanovi from "../../../lib/xanovi_lib";
import { hexToHSL } from "../../../utils/style";
import CircleProgress from "../../CircleProgress";
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
	weekIndex: number;
	total: number;
	completed: number;
}

function switchMatterName(name: string): string {
	return name
		.split(" ")
		.map((str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
		.join(" ");
}

function convertLinks(text: string): string {
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
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const day = today.getDay();
	const diff = today.getDate() - day + (day === 0 ? -6 : 1);
	const mondayThisWeek = new Date(today.setDate(diff));
	mondayThisWeek.setHours(0, 0, 0, 0);

	const mondayNextWeek = new Date(mondayThisWeek);
	mondayNextWeek.setDate(mondayNextWeek.getDate() + 7);

	const sundayNextWeek = new Date(mondayNextWeek);
	sundayNextWeek.setDate(sundayNextWeek.getDate() + 7);

	const weekCurrent: [string, HomeworkItem[]][] = [];
	const weekNext: [string, HomeworkItem[]][] = [];

	const sortedDays = Object.keys(homeworksGrouped).sort();

	for (const dayKey of sortedDays) {
		const date = new Date(dayKey);

		if (date >= mondayThisWeek && date < mondayNextWeek) {
			weekCurrent.push([dayKey, homeworksGrouped[dayKey]]);
		} else if (date >= mondayNextWeek && date < sundayNextWeek) {
			weekNext.push([dayKey, homeworksGrouped[dayKey]]);
		}
	}

	function countWeek(week: [string, HomeworkItem[]][]) {
		let total = 0;
		let completed = 0;

		for (const [, items] of week) {
			total += items.length;
			completed += items.filter((i) => i.completed).length;
		}

		return { total, completed };
	}

	const w0 = countWeek(weekCurrent);
	const w1 = countWeek(weekNext);

	return [
		{ days: weekCurrent, weekIndex: 0, total: w0.total, completed: w0.completed },
		{ days: weekNext, weekIndex: 1, total: w1.total, completed: w1.completed },
	];
}

export const Work = () => {
	const pronote = usePronoteConnected();

	const [homeworks, setHomeworks] = useState<Record<string, HomeworkItem[]>>({});
	const [weeksData, setWeeksData] = useState<WeekData[]>([]);

	useEffect(() => {
		if (!pronote) return;

		const processData = (homeworkInfo: InstanceType<typeof pawnote.Homework>) => {
			const grouped: Record<string, HomeworkItem[]> = {};

			for (const hw of homeworkInfo.entries) {
				const dueDate = new Date(hw.assignment.dueOn);
				const givenDate = new Date(hw.assignment.givenOn);
				const key = dueDate.toISOString().split("T")[0];

				if (!grouped[key]) grouped[key] = [];

				grouped[key].push({
					subject: {
						id: hw.assignment.subject.id,
						name: hw.assignment.subject.label,
					},
					description: hw.assignment.task,
					givenDate,
					dueDate,
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
			const hasInternet = navigator.onLine;

			if (cache && Date.now() - cache.savedAt < ONE_HOUR) {
				console.log("Using cached homeworks");
				setHomeworks(cache.data);
				setWeeksData(groupDaysByWeek(cache.data));
				return;
			}

			if (!hasInternet && cache) {
				console.log("No internet, using cached homeworks");
				setHomeworks(cache.data);
				setWeeksData(groupDaysByWeek(cache.data));
				return;
			}

			try {
				console.log("Fetching new homeworks...");
				const homeworkInfo = await pronote.homework();

				const grouped = processData(homeworkInfo);

				setHomeworks(grouped);
				setWeeksData(groupDaysByWeek(grouped));

				await saveHomework(grouped);
			} catch (err) {
				console.error("Fetch error:", err);

				if (cache) {
					console.log("Falling back to cached homeworks");
					setHomeworks(cache.data);
					setWeeksData(groupDaysByWeek(cache.data));
				}
			}
		};

		loadData();
	}, [pronote]);

	return (
		<div className="work-week">
			{!Object.keys(homeworks).length && <p>Chargement...</p>}

			<div className="days-scroll">
				{weeksData[0] && weeksData[1] && (
					<div className="homework content">
						<div className="progress">
							<CircleProgress max={weeksData[0].total} value={weeksData[0].completed}></CircleProgress>
							<CircleProgress max={weeksData[1].total} value={weeksData[1].completed}></CircleProgress>
						</div>

						<p>
							Semaine actuelle : {weeksData[0].completed} / {weeksData[0].total} faits
						</p>
					</div>
				)}
				{weeksData.map((week, index) => (
					<div key={index} className="homework content">
						{week.days.map(([day, items]) => {
							const formattedDate = new Date(day).toLocaleDateString("fr-FR", {
								weekday: "long",
								day: "numeric",
								month: "long",
							});

							return (
								<div key={day} className="day-content">
									<p className="title">Le {formattedDate}</p>

									{items.map((hw) => {
										const correctedName = switchMatterName(hw.subject.name);
										const color = backgroundToHSL(hw.backgroundColor);
										const itemKey = `${day}-${hw.subject.id}-${hw.description.substring(0, 10)}`;

										return (
											<div
												key={itemKey}
												className={`content card ${hw.completed ? "completed" : ""}`}
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
														console.log("toggle completion for:", hw);
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
				))}
			</div>
		</div>
	);
};

export default Work;
