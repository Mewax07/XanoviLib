export interface FieldMetadata {
	defaultValue?: (() => any) | any;
	deserializer?: (value: any, self: InstanceType<any>) => any;
	enum?: any;
	key: string;
	optional?: boolean;
	rename?: string;
}

export function getModelMetadata(clazz: any): Array<FieldMetadata> {
	return clazz.constructor._propertyMetadata || [];
}

export function getModelMetadataField(clazz: any, field: string): FieldMetadata | undefined {
	return getModelMetadata(clazz).find((local: FieldMetadata) => local.key === field);
}

export function mutateModelMetadataField(clazz: any, field: string, mutation: (metadata: FieldMetadata) => void): void {
	if (!clazz.constructor._propertyMetadata) {
		clazz.constructor._propertyMetadata = [];
	}

	const metadata = getModelMetadataField(clazz, field);

	if (!metadata) {
		const metadata = { key: field };
		mutation(metadata);

		clazz.constructor._propertyMetadata.push(metadata);
	} else {
		mutation(metadata);
	}
}
