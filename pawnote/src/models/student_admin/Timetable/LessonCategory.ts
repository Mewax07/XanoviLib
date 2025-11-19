import { TypeOrigineCreationCategorieCahierDeTexte } from "~p0/api/models/TypeOrigineCreationCategorieCahierDeTexte";
import { CategoryOrigin } from "~p0/api/shared";

export class LessonCategory {
	/** @internal */
	public constructor(private categories: CategoryOrigin) {}

	public get origin(): TypeOrigineCreationCategorieCahierDeTexte {
		return this.categories.kind;
	}

	public get name(): string {
		return this.categories.label;
	}

	public get labelIcon(): string {
		return this.categories.labelIcon;
	}

	public get test(): boolean {
		return (
			this.categories.kind === TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir ||
			this.categories.kind === TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation
		);
	}
}
