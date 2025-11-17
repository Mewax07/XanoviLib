import { getModelMetadata } from "./metadata";
import { SchemaType } from "./schema/type";

export function deserialize<T extends new (...args: any[]) => any>(Model: T, data: any): InstanceType<T> {
	const DEBUG = false;

	const model = new Model();
	const metadata = getModelMetadata(model);

	for (const [field, schema] of Object.entries(model)) {
		if (!(schema instanceof SchemaType)) continue;

		const info = metadata.find((local) => local.key === field);
		let value = data[field];

		if (info?.rename) {
			value = data[info.rename];
		}

		if (DEBUG && (value === null || value === undefined)) {
			console.log(`\nField: "${field}"`);
			console.log("Schema:", {
				typeof: schema.typeof,
				array: !!schema.array,
				reference: schema.reference?.name,
				optional: !!schema.optional,
				enum: schema.enum ? Object.values(schema.enum) : undefined,
			});
			console.log(metadata);
			console.log("Value (raw):", safeStringify(value));
		}

		if (value === null || value === undefined) {
			if (info?.defaultValue !== undefined) {
				if (typeof info.defaultValue === "function") {
					value = info.defaultValue();
				} else {
					value = info.defaultValue;
				}

				if (value === null) {
					throw new Error(`default value for field "${field}" cannot be "null"${schemaLoc(schema)}`);
				} else if (schema.typeof && typeof value !== schema.typeof) {
					throw new Error(
						`default value for field "${field}" has incorrect type, got "${typeof value}" and expected "${schema.typeof}"${schemaLoc(schema)}`,
					);
				} else if (schema.instanceof && !(value instanceof schema.instanceof)) {
					throw new Error(
						`default value for field "${field}" is not an instance of "${schema.instanceof.name}"${schemaLoc(schema)}`,
					);
				} else if (schema.enum && !Object.values(schema.enum).includes(value)) {
					throw new Error(
						`default value (${value}) for field "${field}" does not match any value of provided enum${schemaLoc(schema)}`,
					);
				} else if (schema.reference) {
					throw new Error(
						`default value is not allowed on reference fields ("${field}")${schemaLoc(schema)}`,
					);
				}
			} else if (!schema.optional) {
				throw new Error(`required field "${field}" is undefined in provided data${schemaLoc(schema)}`);
			} else {
				value = null;
			}
		}

		if (value !== null) {
			if (info?.deserializer) {
				value = info.deserializer(value, model);
			} else if (schema.array) {
				const processArray = (value: any, schema: SchemaType): any => {
					if (!Array.isArray(value)) {
						throw new Error(
							`expected array but got "${typeof value}", with value: ${safeStringify(value)}${schemaLoc(schema)}`,
						);
					}

					return value.map((item) => {
						if ((item === null || item === undefined) && schema.optional) {
							return null;
						}

						if (schema.array) {
							return processArray(item, schema.array);
						} else if (schema.reference) {
							try {
								return deserialize(schema.reference, item);
							} catch (err: any) {
								throw new Error(
									`error while deserializing array element of field "${field}": ${err.message}${schemaLoc(schema)}`,
								);
							}
						} else {
							return item;
						}
					});
				};

				value = processArray(value, schema.array);
			} else if (schema.reference) {
				try {
					value = deserialize(schema.reference, value);
				} catch (err: any) {
					throw new Error(
						`error while deserializing reference field "${field}": ${err.message}${schemaLoc(schema)}`,
					);
				}
			}
		}

		if (DEBUG) {
			console.log("Value (final):", safeStringify(value));
		}

		model[field] = value;
	}

	return model;
}

function schemaLoc(schema: SchemaType): string {
	if (schema?.sourceFile) {
		return ` (schema defined at ${schema.sourceFile}:${schema.sourceLine}:${schema.sourceColumn})`;
	}
	return "";
}

function safeStringify(value: any): string {
	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return String(value);
	}
}
