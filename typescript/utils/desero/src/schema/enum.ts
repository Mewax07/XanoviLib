import { captureSchemaLocationFromStack as captureSchemaLocation,SchemaType } from "./type";

const enumeration = <T>(Enum: T): T[keyof T] => {
    const value = new SchemaType();
    value.enum = Enum;
	const err = new Error();
	return captureSchemaLocation(value, err.stack) as any;
}

export { enumeration as enum };