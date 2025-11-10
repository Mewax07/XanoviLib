import { captureSchemaLocationFromStack as captureSchemaLocation,SchemaType } from "./type";

export const instance = <T>(clazz?: new (...args: any[]) => T): T => {
	const value = new SchemaType();
	value.instanceof = clazz;
	const err = new Error();
	return captureSchemaLocation(value, err.stack) as any;
};
