import { Parameters } from "~p0/models/params";
import { TimetableResponse } from "../../../api/timetable";
import { TimetableEntry } from "./TimetableEntry";
import { TimetableEntryActivity } from "./TimetableEntryActivity";
import { TimetableEntryDetention } from "./TimetableEntryDetention";
import { TimetableEntryLesson } from "./TimetableEntryLesson";

export class Timetable {
	public readonly entries: Array<TimetableEntry>;

	public constructor(
		private parameters: Parameters,
		private timetable: TimetableResponse,
	) {
		this.entries = timetable.data.courses.map((lesson) => {
			if (lesson.isFieldTrip) {
				return new TimetableEntryActivity(parameters, lesson);
			}
			if (lesson.isDetention) {
				return new TimetableEntryDetention(parameters, lesson);
			}

			return new TimetableEntryLesson(parameters, lesson);
		});

		this.entries.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
	}

	private get withCanceledClasses(): boolean {
		return this.timetable.data.withCanceledCourse; // NOTE: if optional, use `?? true` !
	}

	public filter(
		withSuperposedCanceledClasses = false,
		withCanceledClasses = this.withCanceledClasses,
		withPlannedClasses = true,
	): Array<TimetableEntry> {
		const invisible = new Set<TimetableEntry>();

		if (!withCanceledClasses) {
			for (const current of this.entries) {
				if (current instanceof TimetableEntryLesson && current.canceled) {
					invisible.add(current);
				}
			}
		}

		console.log(withPlannedClasses);
		if (!withPlannedClasses) {
			for (const current of this.entries) {
				if (
					current instanceof TimetableEntryLesson &&
					!invisible.has(current) &&
					!current.canceled &&
					[
						// TODO: create lesson kind enum
						0, // EnseignementNormal
						// 1, // ConseilDeClasse
						// 2, // EnseignementRemplacement
						3, // EnseignementHistorique
						4, // EnseignementSuppleant
					].includes(current.kind)
				)
					invisible.add(current);
			}
		}

		if (withCanceledClasses && !withSuperposedCanceledClasses) {
			let foundInvisibleCanceled = true;
			while (foundInvisibleCanceled) {
				foundInvisibleCanceled = this.makeSuperimposedCanceledClassesInvisible(invisible);
			}
		}

		return this.entries.filter((entry) => !invisible.has(entry));
	}

	private getClassEndBlockPosition(givenClass: TimetableEntry): number {
		const blocksPerDay = this.parameters.slotsPerDay;

		const startBlockPosition = Math.floor(givenClass.blockPosition / blocksPerDay);
		let endBlockPosition = givenClass.blockPosition + givenClass.blockLength - 1;

		if (Math.floor(endBlockPosition / blocksPerDay) !== startBlockPosition) {
			endBlockPosition = startBlockPosition * blocksPerDay + blocksPerDay - 1;
		}

		return endBlockPosition;
	}

	private getSuperimposedClassesIndexes(classItem: TimetableEntry, classIndex: number, busyPositions: number[]) {
		const classesSuperimposed = [classIndex];

		const startBlockPosition = classItem.blockPosition;
		const endBlockPosition = this.getClassEndBlockPosition(classItem);

		for (
			let currentBlockPosition = startBlockPosition;
			currentBlockPosition <= endBlockPosition;
			currentBlockPosition++
		) {
			const busyClassIndex = busyPositions[currentBlockPosition];

			if (typeof busyClassIndex !== "undefined") {
				if (busyClassIndex !== classIndex && !classesSuperimposed.includes(busyClassIndex))
					classesSuperimposed.push(busyClassIndex);
			}
		}

		return classesSuperimposed;
	}

	private makeSuperimposedCanceledClassesInvisible(invisible: Set<TimetableEntry>): boolean {
		const busyPositionsPerWeek: Record<number, number[]> = {};

		for (let classIndex = 0; classIndex < this.entries.length; classIndex++) {
			const currentClass = this.entries[classIndex];

			if (!(currentClass.weekNumber in busyPositionsPerWeek)) busyPositionsPerWeek[currentClass.weekNumber] = [];
			const busyPositions = busyPositionsPerWeek[currentClass.weekNumber];

			const startBlockPosition = currentClass.blockPosition;
			const endBlockPosition = this.getClassEndBlockPosition(currentClass);

			if (!invisible.has(currentClass)) {
				for (
					let currentBlockPosition = startBlockPosition;
					currentBlockPosition <= endBlockPosition;
					currentBlockPosition++
				) {
					if (typeof busyPositions[currentBlockPosition] === "undefined") {
						busyPositions[currentBlockPosition] = classIndex;
					} else {
						const superimposedClassesIndexes = this.getSuperimposedClassesIndexes(
							currentClass,
							classIndex,
							busyPositions,
						);

						let withCanceledClasses = false;
						let withNormalClasses = false;

						for (const classe of superimposedClassesIndexes) {
							const superimposedClass = this.entries[classe];

							if (!withNormalClasses) {
								withNormalClasses = !(
									superimposedClass instanceof TimetableEntryLesson && superimposedClass.canceled
								);
							}

							if (!withCanceledClasses) {
								withCanceledClasses =
									superimposedClass instanceof TimetableEntryLesson && superimposedClass.canceled;
							}
						}

						if (withNormalClasses && withCanceledClasses) {
							for (const classe of superimposedClassesIndexes) {
								const superimposedClass = this.entries[classe];

								if (
									superimposedClass &&
									superimposedClass instanceof TimetableEntryLesson &&
									superimposedClass.canceled
								) {
									invisible.add(superimposedClass);
									return true;
								}
							}
						}

						break;
					}
				}
			}
		}

		return false;
	}
}
