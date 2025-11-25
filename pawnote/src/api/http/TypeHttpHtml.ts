import { TypeHttpVariable } from "./TypeHttpVariable";

interface Html {
	_T: TypeHttpVariable.TypeHttpHtml;
	V: string;
}

export class TypeHttpHtml {
	public static deserializer = (value: Html): string => {
		if (value._T !== TypeHttpVariable.TypeHttpHtml) throw new Error("HTTP type is not compatible");

		return value.V;
	};
}
