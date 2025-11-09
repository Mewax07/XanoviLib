export class SchemaType {
	array?: SchemaType;
	enum?: any;
	instanceof?: any;
	optional = false;
	reference?: new (...args: any[]) => any;
	typeof?: "boolean" | "number" | "string";

	sourceFile?: string;
	sourceLine?: number;
	sourceColumn?: number;
}

export function captureSchemaLocation(schema: SchemaType) {
	const err = new Error();
	if (!err.stack) return schema;

	const lines = err.stack.split(/\r?\n/);

	for (const line of lines) {
		if (line.includes("basics.ts") || line.includes("node:internal") || line.includes("node_modules")) continue;

		const match = line.match(/\((.*):(\d+):(\d+)\)$/);
		if (match) {
			schema.sourceFile = match[1];
			schema.sourceLine = Number(match[2]);
			schema.sourceColumn = Number(match[3]);
			break;
		}
	}

	return schema;
}