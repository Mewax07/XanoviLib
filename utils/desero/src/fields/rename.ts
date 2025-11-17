import { mutateModelMetadataField } from "../metadata";

export function rename(name: string) {
	return function (clazz: any, field: string) {
		mutateModelMetadataField(clazz, field, (metadata) => {
			metadata.rename = name;
			if (field === "subject") {
				console.log(name, clazz, field);
				console.log(metadata.rename);
			}
		});
	};
}
