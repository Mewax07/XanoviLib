import { LessonCategory } from "./LessonCategory";
import { Subject } from "./Subject";
import { TimetableEntry } from "./TimetableEntry";

export class TimetableEntryLesson extends TimetableEntry {
	public get kind(): number {
		return this.course.kind;
	}

	public get categories(): Array<LessonCategory> {
		return this.course.notebook?.categories.map((categorie) => new LessonCategory(categorie)) ?? [];
	}

	public get status(): string | null {
		return this.course.status;
	}

	public get canceled(): boolean {
		return this.course.isCancelled ?? false;
	}

	public get resourceId(): string | null {
		if (this.course.withNotebook && this.course.notebook) {
			return this.course.notebook.id;
		}

		return null;
	}

	public get test(): boolean {
		return this.course.notebook?.isTest ?? false;
	}

	public get exempted(): boolean {
		return this.course.studentExcused ?? false;
	}

	public get subject(): Subject | null {
		const value = this.course.content.find((contenu) => contenu.kind === 16);

		if (!value) return null;
		return new Subject(value.id!, value.label, value.isServiceGroup ?? false);
	}

	public get teachers(): Array<string> {
		return this.course.content.filter((contenu) => contenu.kind === 3).map((contenu) => contenu.label);
	}

	public get staff(): Array<string> {
		return this.course.content.filter((contenu) => contenu.kind === 34).map((contenu) => contenu.label);
	}

	public get rooms(): Array<string> {
		return this.course.content.filter((contenu) => contenu.kind === 17).map((contenu) => contenu.label);
	}

	public get groups(): Array<string> {
		return this.course.content.filter((contenu) => contenu.kind === 2).map((contenu) => contenu.label);
	}
}
