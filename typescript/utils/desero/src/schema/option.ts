import { captureSchemaLocation, SchemaType } from "./type"

export const option = <T>(value: T): null | T => {
    (value as SchemaType).optional = true;
	return captureSchemaLocation(value as SchemaType) as T;
}