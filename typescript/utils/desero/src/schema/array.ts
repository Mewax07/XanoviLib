import { captureSchemaLocation, SchemaType } from "./type"

export const array = <T>(inner: T): Array<T> => {
    const value = new SchemaType();
    value.array = inner as SchemaType;
    return captureSchemaLocation(value) as any;
}