import { captureSchemaLocation, SchemaType } from "./type";

export const number = (): number => {
	const value = new SchemaType();
	value.typeof = "number";
	return captureSchemaLocation(value) as any;
};

export const string = (): string => {
	const value = new SchemaType();
	value.typeof = "string";
	return captureSchemaLocation(value) as any;
};

export const boolean = (): boolean => {
	const value = new SchemaType();
	value.typeof = "boolean";
	return captureSchemaLocation(value) as any;
};
