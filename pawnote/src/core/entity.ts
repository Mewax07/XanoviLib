let id = -1000;

export function createEntityID(): number {
	id -= 1;
	return id;
}
