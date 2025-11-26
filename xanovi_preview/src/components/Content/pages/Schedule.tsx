import React, { useEffect, useRef, useState } from "react";
import { usePronoteConnected } from "../../../api/homepage";
import { loadSchedule, saveSchedule } from "../../../cache/scheduleCache";
import { hexToHSL, supportSquircle } from "../../../utils/style";

import { ONE_HOUR } from "..";
import Xanovi from "../../../lib/xanovi_lib";
const pawnote = Xanovi.pronote;

interface Course {
	startDate: Date;
	endDate: Date;
	subject: {
		name: string;
		id: string;
		canceled: boolean;
		test: boolean;
	};
	teacherNames: string[];
	classrooms: string[];
	backgroundColor?: string;
	status?: string;
}

function getPauseInfo(lastEnd: Date, nextStart: Date) {
	const diff = nextStart.getTime() - lastEnd.getTime();
	const minutes = Math.round(diff / 60000);

	const duration =
		minutes >= 60 ? `${Math.floor(minutes / 60)}h${(minutes % 60).toString().padStart(2, "0")}` : `${minutes} min`;

	if (minutes < 45) {
		return { label: "Intercours", duration };
	}

	const midTime = lastEnd.getTime() + diff / 2;
	const mid = new Date(midTime);
	const midHour = mid.getHours() + mid.getMinutes() / 60;

	let label = "Pause";
	let icon = "fa-sun";

	if (midHour < 10.5) {
		label = "Pause matinale";
		icon = "fa-sun-haze";
	} else if (midHour >= 10.5 && midHour < 14.5) {
		label = "Pause méridienne";
		icon = "fa-utensils";
	} else {
		label = "Pause de l'après-midi";
	}

	return { label, icon, duration };
}

function removeDucplicateCourses(courses: Course[]) {
	const cleaned: Course[] = [];

	for (let i = 0; i < courses.length; i++) {
		const current = courses[i];
		const duplicate = courses.find(
			(c) =>
				c !== current &&
				c.startDate.getTime() === current.startDate.getTime() &&
				c.endDate.getTime() === current.endDate.getTime(),
		);

		if (duplicate && current.subject.canceled && !duplicate.subject.canceled) {
			continue;
		}

		cleaned.push(current);
	}

	return cleaned;
}

export const Schedule = () => {
	const pronote = usePronoteConnected();

	const [days, setDays] = useState<Record<string, Course[]>>({});
	const carouselRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = carouselRef.current;
		if (!el) return;

		let isDown = false;
		let startX = 0;
		let scrollLeft = 0;

		const mouseDown = (e: MouseEvent) => {
			isDown = true;
			startX = e.pageX - el.offsetLeft;
			scrollLeft = el.scrollLeft;
			el.style.cursor = "grabbing";
		};

		const mouseUp = () => {
			isDown = false;
			el.style.cursor = "grab";
		};

		const mouseMove = (e: MouseEvent) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - el.offsetLeft;
			const walk = x - startX;
			el.scrollLeft = scrollLeft - walk;
		};

		el.addEventListener("mousedown", mouseDown);
		el.addEventListener("mouseleave", mouseUp);
		el.addEventListener("mouseup", mouseUp);
		el.addEventListener("mousemove", mouseMove);

		return () => {
			el.removeEventListener("mousedown", mouseDown);
			el.removeEventListener("mouseleave", mouseUp);
			el.removeEventListener("mouseup", mouseUp);
			el.removeEventListener("mousemove", mouseMove);
		};
	}, []);
	useEffect(() => {
		if (!pronote) return;
		const processData = (timetableInfo: InstanceType<typeof pawnote.Timetable>) => {
			const grouped: Record<string, Course[]> = {};

			for (const entry of timetableInfo.entries) {
				const dateObj = new Date(entry.startDate);
				const dayKey = dateObj.toISOString().split("T")[0];

				if (!grouped[dayKey]) grouped[dayKey] = [];

				if (entry instanceof pawnote.TimetableEntryLesson) {
					grouped[dayKey].push({
						startDate: entry.startDate,
						endDate: entry.endDate,
						classrooms: entry.rooms,
						subject: {
							name: entry.subject!.name,
							id: entry.subject!.id,
							canceled: entry.canceled,
							test: entry.test,
						},
						teacherNames: entry.teachers,
						backgroundColor: entry.backgroundColor!,
						status: entry.status!,
					});
				}
			}

			for (const day in grouped) {
				grouped[day] = removeDucplicateCourses(grouped[day]);
				grouped[day].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
			}

			const sortedDays = Object.keys(grouped).sort();

			const weekDays = sortedDays.slice(0, 5);

			const limitedGrouped: Record<string, Course[]> = {};
			weekDays.forEach((day) => {
				limitedGrouped[day] = grouped[day];
			});

			return limitedGrouped;
		};

		const loadData = async () => {
			const cache = await loadSchedule<Record<string, Course[]>>();

			const hasInternet = navigator.onLine;

			if (cache && Date.now() - cache.savedAt < ONE_HOUR) {
				console.log("Using cached schedule");
				setDays(cache.data);
				return;
			}

			if (!hasInternet && cache) {
				console.log("No internet, using old cache");
				setDays(cache.data);
				return;
			}

			try {
				console.log("Fetching new timetable...");
				const timetableInfo = await pronote.timetable();
				console.log(timetableInfo);

				const grouped = processData(timetableInfo);

				setDays(grouped);
				await saveSchedule(grouped);
			} catch (err) {
				console.error("Fetch error:", err);

				if (cache) {
					console.log("Falling back to cache...");
					setDays(cache.data);
				}
			}
		};

		loadData();
	}, [pronote]);

	return (
		<div className="carousel-container">
			{!Object.keys(days).length && <p>Chargement...</p>}

			<div className="carousel" ref={carouselRef}>
				{Object.keys(days)
					.sort()
					.map((dayKey) => {
						const courses = days[dayKey];
						if (!courses.length) return null;

						let lastEnd: Date | null = null;
						const firstCourse = courses[0];
						const dateObj = new Date(firstCourse.startDate);

						const weekdayName = dateObj.toLocaleDateString("fr-FR", { weekday: "long" });
						const dayNumber = dateObj.getDate();
						const monthShort = dateObj.toLocaleDateString("fr-FR", { month: "short" });

						const dayDisplay = `${weekdayName.charAt(0).toUpperCase() + weekdayName.slice(1)} ${dayNumber} ${monthShort}`;

						return (
							<div className="schedule-day content" key={dayKey}>
								<p className="title">Cours du {dayDisplay}</p>

								{courses.length === 0 && <p className="no-class">Aucun cours.</p>}

								{courses.map((course, i) => {
									const start = new Date(course.startDate);
									const end = new Date(course.endDate);

									const hsl = course.backgroundColor
										? hexToHSL(course.backgroundColor)
										: "hsl(210, 50%, 70%)";

									const accent = hsl.match(/hsl\((\d+)/)?.[1] ?? "210";

									let pauseBlock = null;
									if (lastEnd && start.getTime() > lastEnd.getTime()) {
										const { label, icon, duration } = getPauseInfo(lastEnd, start);

										pauseBlock = (
											<div
												key={`pause-${i}`}
												className="content card no-class"
												style={
													{
														"--_-accent": "0",
														"--_-light": "0%",
													} as React.CSSProperties
												}
											>
												<div>
													<p className="duration">{duration}</p>
												</div>

												<div
													className="separator"
													style={
														{
															"--_-accent": "0",
															"--_-light": "0%",
															"--_-opacity": "0.4",
														} as React.CSSProperties
													}
												></div>

												<div className="utils">
													<i className={`fa-regular ${icon}`}></i>
													<p>{label}</p>
												</div>
											</div>
										);
									}

									lastEnd = end;

									const durationClass =
										end.getTime() - start.getTime() > 3600000 ? "expanded" : "normal";

									const diff = course.endDate.getTime() - course.startDate.getTime();
									const minutes = Math.round(diff / 60000);
									const duration =
										minutes >= 60
											? `${Math.floor(minutes / 60)}h${(minutes % 60).toString().padStart(2, "0")}`
											: `${minutes} min`;

									return (
										<>
											{pauseBlock}

											<div
												className={`content card ${durationClass} ${supportSquircle() && "squircle"}`}
												key={i}
												style={
													{
														"--_-bf-accent": accent,
														"--_-bf-light": "80%",
														"--_-bf-opacity": "0.7",
														"--_-af-accent": accent,
														"--_-af-light": "70%",
														"--_-af-opacity": "0.9",
													} as React.CSSProperties
												}
											>
												<div className="time">
													<p>
														{start.toLocaleTimeString("fr-FR", {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</p>
													<p>
														{end.toLocaleTimeString("fr-FR", {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</p>
												</div>

												<div
													className="separator"
													style={
														{
															"--_-accent": accent,
															"--_-light": "60%",
															"--_-opacity": "0.8",
														} as React.CSSProperties
													}
												></div>

												<div className="info">
													<p className="matter">{course.subject.name}</p>
													<div className="utils">
														<i className="fa-regular fa-location-dot"></i>
														<p>{course.classrooms.join(", ")}</p>
														<p>|</p>
														<i className="fa-regular fa-user"></i>
														<p>{course.teacherNames.join(", ")}</p>
													</div>
													<div className="status">
														{course.status && (
															<p
																className="change"
																style={
																	{
																		"--_-accent": accent,
																		"--_-light": "60%",
																		"--_-opacity": "0.8",
																	} as React.CSSProperties
																}
															>
																{course.status}
															</p>
														)}
														<p>{duration}</p>
													</div>
												</div>
											</div>
										</>
									);
								})}
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default Schedule;
