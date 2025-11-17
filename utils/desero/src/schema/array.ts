import { captureSchemaLocationFromStack as captureSchemaLocation,SchemaType } from "./type";

export const array = <T>(inner: T): Array<T> => {
	const value = new SchemaType();
	value.array = inner as SchemaType;
	const err = new Error();
	return captureSchemaLocation(value, err.stack) as any;
};
