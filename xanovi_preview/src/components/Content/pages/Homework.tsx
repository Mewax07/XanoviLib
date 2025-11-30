import { useCallback, useEffect, useState } from "react";
import { usePronoteConnected } from "../../../api/homepage";

import { ONE_HOUR } from "..";
import { loadHomework, saveHomework } from "../../../cache/homeworkCache";
import Xanovi from "../../../lib/xanovi_lib";
import { hexToHSL } from "../../../utils/style";
import CircleProgress from "../../CircleProgress";
const pawnote = Xanovi.pronote;

declare enum AttachmentDifficulty {
	None = 0,
	Easy = 1,
	Medium = 2,
	Hard = 3
}

interface HomeworkItem {
	id: string;
	subject: {
		id: string;
		name: string;
	};
	description: string;
	givenDate: Date;
	dueDate: Date;
	completed: boolean;
	backgroundColor: string;
	difficulty: AttachmentDifficulty;
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

function parseDateUTC(dateStr: string) {
	const d = new Date(dateStr);
	const result = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
	return result;
}

function formatLocalDate(date: Date, withYear = false): string {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");

	if (withYear) {
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}
	return `${day}/${month}`;
}

const getRemainingTimeText = (dueDate: Date): string => {
	const now = new Date();
	let diffInMs = dueDate.getTime() - now.getTime();

	if (diffInMs < 0) {
		const absDiffInDays = Math.abs(diffInMs) / (1000 * 60 * 60 * 24);

		if (absDiffInDays > 1.5) {
			return "Échéance dépassée";
		}
		return "Échéance passée";
	}

	const minutes = Math.floor(diffInMs / (1000 * 60));
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days >= 7) {
		return dueDate.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
	}

	if (days > 0) {
		return `Dans ${days}j`;
	}

	if (hours > 0) {
		return `Dans ${hours}h`;
	}

	if (minutes > 0) {
		return `Dans ${minutes}min`;
	}

	return "Maintenant";
};

function getMonday(date: Date) {
	const day = date.getDay();
	const diff = (day === 0 ? -6 : 1) - day;
	const monday = new Date(date);
	monday.setDate(date.getDate() + diff);
	monday.setHours(0, 0, 0, 0);
	return monday;
}

function groupDaysByWeek(homeworksGrouped: Record<string, HomeworkItem[]>): WeekData[] {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	let mondayWeek0 = getMonday(today);

	if (today.getDay() === 0) {
		mondayWeek0.setDate(mondayWeek0.getDate() + 7);
	}

	const mondayWeek1 = new Date(mondayWeek0);
	mondayWeek1.setDate(mondayWeek1.getDate() + 7);

	const mondayWeek2 = new Date(mondayWeek1);
	mondayWeek2.setDate(mondayWeek2.getDate() + 7);

	const weekCurrent: [string, HomeworkItem[]][] = [];
	const weekNext: [string, HomeworkItem[]][] = [];

	const sortedDays = Object.keys(homeworksGrouped).sort();

	for (const dayKey of sortedDays) {
		const date = parseDateUTC(dayKey);

		if (date >= mondayWeek0 && date < mondayWeek1) {
			weekCurrent.push([dayKey, homeworksGrouped[dayKey]]);
		} else if (date >= mondayWeek1 && date < mondayWeek2) {
			weekNext.push([dayKey, homeworksGrouped[dayKey]]);
		}
	}

	function countWeek(week: [string, HomeworkItem[]][]) {
		let total = 0,
			completed = 0;
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

	const [updatingHomeworks, setUpdatingHomeworks] = useState(new Set<string>());

	const processData = (homeworkInfo: InstanceType<typeof pawnote.Homework>): Record<string, HomeworkItem[]> => {
		const grouped: Record<string, HomeworkItem[]> = {};

		for (const hw of homeworkInfo.entries) {
			const dueDate = new Date(hw.assignment.dueOn);
			const givenDate = new Date(hw.assignment.givenOn);

			const year = dueDate.getFullYear();
			const month = String(dueDate.getMonth() + 1).padStart(2, "0");
			const day = String(dueDate.getDate()).padStart(2, "0");

			const key = `${year}-${month}-${day}`;

			if (!grouped[key]) grouped[key] = [];

			grouped[key].push({
				id: hw.assignment.id,
				subject: {
					id: hw.assignment.subject.id,
					name: hw.assignment.subject.label,
				},
				description: hw.assignment.task,
				givenDate,
				dueDate,
				completed: hw.assignment.isCompleted,
				backgroundColor: hw.assignment.backgroundColor,
				difficulty: hw.assignment.difficultyLevel
			});
		}

		for (const day in grouped) {
			grouped[day].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
		}

		return grouped;
	};

	const fetchAndProcessHomeworks = useCallback(
		async (forceFetch = false) => {
			if (!pronote) return;

			const cache = await loadHomework<Record<string, HomeworkItem[]>>();
			const hasInternet = navigator.onLine;

			if (!forceFetch) {
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

				if (cache && !forceFetch) {
					console.log("Falling back to cached homeworks");
					setHomeworks(cache.data);
					setWeeksData(groupDaysByWeek(cache.data));
				}
			}
		},
		[pronote],
	);

	const updateHomeworkCompletion = useCallback(
		async (dateKey: string, homeworkId: string, currentStatus: boolean) => {
			if (!pronote) return;

			setUpdatingHomeworks((prev) => new Set(prev).add(homeworkId));

			setHomeworks((prevHomeworks) => {
				const newHomeworks = { ...prevHomeworks };
				const dayItems = newHomeworks[dateKey];

				if (dayItems) {
					const itemIndex = dayItems.findIndex((item) => item.id === homeworkId);
					if (itemIndex !== -1) {
						dayItems[itemIndex].completed = !currentStatus;
					}
				}

				setWeeksData(groupDaysByWeek(newHomeworks));
				return newHomeworks;
			});

			try {
				const homeworkInfo = await pronote.homework();
				const homeworkEntry = homeworkInfo.entries.find((hw) => hw.assignment.id === homeworkId);

				if (homeworkEntry) {
					await homeworkEntry.assignment.toggleDone();
					console.log(`Toggled completion for ${homeworkId} to ${!currentStatus}`);
				} else {
					console.warn("Homework entry not found for API toggle.");
				}

				await new Promise((resolve) => setTimeout(resolve, 500));

				await fetchAndProcessHomeworks(true);
			} catch (error) {
				console.error("Error toggling homework completion:", error);

				await fetchAndProcessHomeworks(true);
			} finally {
				setUpdatingHomeworks((prev) => {
					const newSet = new Set(prev);
					newSet.delete(homeworkId);
					return newSet;
				});
			}
		},
		[pronote, fetchAndProcessHomeworks],
	);

	useEffect(() => {
		fetchAndProcessHomeworks();
	}, [fetchAndProcessHomeworks]);

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
										const itemKey = `${day}-${hw.subject.id}-${hw.id}`;

										const isUpdating = updatingHomeworks.has(hw.id);

										return (
											<div
												key={itemKey}
												className={`content card`}
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
												<div className="info">
													<p
														className="matter"
														style={
															{
																"--_-accent": color.accent,
																"--_-light": "60%",
																"--_-opacity": "0.8",
															} as React.CSSProperties
														}
													>
														{correctedName}
													</p>
													<p
														className="context"
														dangerouslySetInnerHTML={{
															__html: convertLinks(hw.description),
														}}
													/>
												</div>
												<div className="top-info">
													<div className="actions">
														<div
															className={`action-btn check ${isUpdating ? "disabled" : ""}`}
															style={
																{
																	"--_-accent": color.accent,
																	"--_-light": "60%",
																	"--_-opacity": "0.8",
																} as React.CSSProperties
															}
															onClick={() => {
																if (!isUpdating) {
																	updateHomeworkCompletion(day, hw.id, hw.completed);
																}
															}}
														>
															<i
																className={`fa-regular ${
																	isUpdating
																		? "fa-spinner-third fa-spin"
																		: hw.completed
																			? "fa-circle-check"
																			: "fa-circle-dashed"
																}`}
															/>
															<p>
																{isUpdating
																	? "Validation..."
																	: hw.completed
																		? "Terminer"
																		: "Commencer"}
															</p>
														</div>
														<div
															className="action-btn"
															style={
																{
																	"--_-accent": color.accent,
																	"--_-light": "60%",
																	"--_-opacity": "0.8",
																} as React.CSSProperties
															}
														>
															<i className="fa-regular fa-clock"></i>
															<p>{getRemainingTimeText(hw.dueDate)}</p>
														</div>
													</div>
													<div className="given">
														<p>{formatLocalDate(hw.givenDate)}</p>
													</div>
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
