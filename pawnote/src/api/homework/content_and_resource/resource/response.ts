import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpDateTime } from "../../../http/TypeHttpDateTime";
import { TypeHttpElement } from "../../../http/TypeHttpElement";
import { Content, Id } from "../../../shared";

export class Service {
	@rename("L")
	public label = t.string();

	@rename("N")
	public id = t.string();

	@rename("G")
	public kind = t.number();

	@rename("couleur")
	public color = t.string();
}

export class Periode {
	@rename("L")
	public label = t.string();

	@rename("N")
	public id = t.string();
}

export class ResourceSubject extends Id {}

export class Resource {
	@rename("G")
	public kind = t.option(t.number());

	// TODO: Search value of the array
	// @rename("ListeThemes")

	@deserializeWith(TypeHttpDateTime.deserializer)
	public date = t.reference(Date);

	@rename("matiere")
	@deserializeWith(new TypeHttpElement(ResourceSubject).single)
	public subject = t.array(t.reference(ResourceSubject));

	@rename("ressources")
	@deserializeWith(new TypeHttpElement(Content).array)
	public resources = t.option(t.array(t.reference(Content)));
}

export class EducationalResource {
	@rename("listeMatieres")
	@deserializeWith(new TypeHttpElement(Service).array)
	public listOfContents = t.array(t.reference(Service));

	@rename("listeRessources")
	@deserializeWith(new TypeHttpElement(Resource).array)
	public listResources = t.array(t.reference(Resource));
}

export class HomeworkModel {
	@rename("ListeRessourcesPedagogiques")
	@deserializeWith(new TypeHttpElement(EducationalResource).single)
	public resourcesList = t.reference(EducationalResource)
}
