import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpDateTime } from "../../../http/TypeHttpDateTime";
import { TypeHttpElement } from "../../../http/TypeHttpElement";
import { CategoryOrigin, HomeworkContentSubject, Id, Label } from "../../../shared";

export class Content extends Label {
	@rename("ListePieceJointe")
	@deserializeWith(new TypeHttpElement(Id).single)
	public unk_ListePieceJointe = t.option(t.array(t.reference(Id))); // Unkown ListePieceJointe array result

	@rename("ListeThemes")
	@deserializeWith(new TypeHttpElement(Id).single)
	public unk_ListeThemes = t.option(t.array(t.reference(Id))); // Unkown ListeThemes array result

	@rename("categorie")
	@deserializeWith(new TypeHttpElement(CategoryOrigin).single)
	public category = t.option(t.array(t.reference(CategoryOrigin)));

	// @rename("descriptif")

	@rename("libelleCBTheme")
	public themeLabel = t.option(t.string());
}

export class _Homework extends Id {
	@rename("CouleurFond")
	public backgroundColor = t.string();

	@rename("Date")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public date = t.instance(Date);

	@rename("DateFin")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public endDate = t.instance(Date);

	@rename("Matiere")
	@deserializeWith(new TypeHttpElement(HomeworkContentSubject).single)
	public subject = t.array(t.reference(HomeworkContentSubject));

	@rename("cours")
	@deserializeWith(new TypeHttpElement(Id).single)
	public course = t.option(t.array(t.reference(Id)));

	@rename("dateTAF")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public dueDate = t.instance(Date);

	@rename("listeContenus")
	@deserializeWith(new TypeHttpElement(Content).single)
	public contentList = t.option(t.array(t.reference(Content)));

	@rename("listeProfesseurs")
	@deserializeWith(new TypeHttpElement(Label).single)
	public teacherList = t.array(t.reference(Label));

	@rename("verouille")
	public locked = t.option(t.boolean());
}

export class HomeworkModel {
	@rename("ListeTravauxAFaire")
	@deserializeWith(new TypeHttpElement(_Homework).array)
	public homeworkList = t.array(t.reference(_Homework));
}
