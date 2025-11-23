import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpDateTime } from "../../http/TypeHttpDateTime";
import { TypeHttpElement } from "../../http/TypeHttpElement";
import { HomeworkContentSubject, Id } from "../../shared";
import { AttachmentDifficulty, AttachmentReturnKind } from "~p0/api/models/attachment";

export class HomeworkBase {
	@rename("N")
	public id = t.string();

	@rename("duree")
	public duringTime = t.number();

	@rename("CouleurFond")
	public backgroundColor = t.string();

	@rename("peuRendre")
	public canComplete = t.option(t.boolean());

	@rename("avecRendu")
	public withReturn = t.option(t.boolean());

	@rename("TAFFait")
	public done = t.boolean();

	@rename("genreRendu")
	public returnType = t.option(t.enum(AttachmentReturnKind));

	@rename("niveauDifficulte")
	public difficultyLevel = t.option(t.enum(AttachmentDifficulty));
}


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
	public homeworkList = t.array(t.reference(_Homework));
}
