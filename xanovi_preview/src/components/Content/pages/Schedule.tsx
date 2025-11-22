import { useEffect, useRef, useState } from "react";
import { usePronoteConnected } from "../../../api/homepage";
import Xanovi from "../../../lib/xanovi_lib";
import { hexToHSL } from "../../../utils/color";
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

		const fetchData = async () => {
			try {
				const timetableInfo = await pronote.timetable();

				const grouped: Record<string, Course[]> = {};

				for (const entry of timetableInfo.entries) {
					const day = new Date(entry.startDate).toLocaleDateString("fr-FR", {
						weekday: "long",
					});

					if (!grouped[day]) grouped[day] = [];

					if (entry instanceof pawnote.TimetableEntryLesson) {
						grouped[day].push({
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

				setDays(grouped);
			} catch (err) {
				console.error("Erreur Timetable:", err);
			}
		};

		fetchData();
	}, [pronote]);

	return (
		<div className="carousel-container">
			{!Object.keys(days).length && <p>Chargement...</p>}

			<div className="carousel" ref={carouselRef}>
				{Object.keys(days).map((day) => {
					const courses = days[day];
					let lastEnd: Date | null = null;

					return (
						<div className="schedule-day content" key={day}>
							<p className="title">Cours du {day}</p>

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
											className="content no-class"
											style={
												{
													"--_-bf-light": "80%",
													"--_-bf-opacity": "0.5",
												} as any
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
													} as any
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

								const durationClass = end.getTime() - start.getTime() > 3600000 ? "expanded" : "normal";

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
											className={`content ${durationClass}`}
											key={i}
											style={
												{
													"--_-bf-accent": accent,
													"--_-bf-light": "80%",
													"--_-bf-opacity": "0.7",
													"--_-af-accent": accent,
													"--_-af-light": "70%",
													"--_-af-opacity": "0.9",
												} as any
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
													} as any
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
														<p className="change"
															style={
																{
																	"--_-accent": accent,
																	"--_-light": "60%",
																	"--_-opacity": "0.8",
																} as any
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
