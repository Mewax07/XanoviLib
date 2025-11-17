import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpElement } from "../http/TypeHttpElement";
import { HomeworkBase, HomeworkContentSubject, Id } from "../shared";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";

export class _Homework extends HomeworkBase {
	@rename("nomPublic")
	public publicName = t.option(t.string());

	@rename("libelleCBTheme")
	public themeLabel = t.option(t.string());

	@rename("avecMiseEnForme")
	public withFormat = t.boolean();

	@rename("DonneLe")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public givenOn = t.instance(Date);

	@rename("PourLe")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public dueOn = t.instance(Date);

	@rename("Matiere")
	@deserializeWith(new TypeHttpElement(HomeworkContentSubject).single)
	public subject = t.array(t.reference(HomeworkContentSubject));

	@rename("cours")
	@deserializeWith(new TypeHttpElement(Id).single)
	public course = t.option(t.array(t.reference(Id)));

	// @rename("descriptif")
}

export class HomeworkModel {
	@rename("ListeTravauxAFaire")
	@deserializeWith(new TypeHttpElement(_Homework).array)
	public toDoList = t.array(t.reference(_Homework));
}
