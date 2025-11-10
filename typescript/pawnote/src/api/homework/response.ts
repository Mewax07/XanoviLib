import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpElement } from "../http/TypeHttpElement";
import { _Homework } from "../shared";

export class HomeworkModel {
	@rename("ListeTravauxAFaire")
	@deserializeWith(new TypeHttpElement(_Homework).array)
	public toDoList = t.array(t.reference(_Homework));
}
