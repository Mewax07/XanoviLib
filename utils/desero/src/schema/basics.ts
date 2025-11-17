import { captureSchemaLocationFromStack as captureSchemaLocation,SchemaType } from "./type";

export const number = (): number => {
	const value = new SchemaType();
	value.typeof = "number";
	const err = new Error();
	return captureSchemaLocation(value, err.stack) as any;
};

export const string = (): string => {
	const value = new SchemaType();
	value.typeof = "string";
	const err = new Error();
	return captureSchemaLocation(value, err.stack) as any;
};

export const boolean = (): boolean => {
	const value = new SchemaType();
	value.typeof = "boolean";
	const err = new Error();
	return captureSchemaLocation(value, err.stack) as any;
};
