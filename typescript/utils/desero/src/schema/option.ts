import { captureSchemaLocationFromStack as captureSchemaLocation,SchemaType } from "./type";

export const option = <T>(value: T): null | T => {
    (value as SchemaType).optional = true;
	const err = new Error();
	return captureSchemaLocation(value as SchemaType, err.stack) as T;
}