import { BaseDirectory, exists, mkdir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

export interface CachedHomework<T> {
	savedAt: number;
	data: T;
}

const folder = "homework";
const file = "homework/cache.json";

export async function saveHomework<T>(data: T) {
	const folderExists = await exists(folder, { baseDir: BaseDirectory.AppLocalData });
	if (!folderExists) {
		await mkdir(folder, { baseDir: BaseDirectory.AppLocalData });
	}

	const payload: CachedHomework<T> = {
		savedAt: Date.now(),
		data,
	};

	await writeTextFile(file, JSON.stringify(payload), { baseDir: BaseDirectory.AppLocalData });
}

export async function loadHomework<T>(): Promise<CachedHomework<T> | null> {
	const fileExists = await exists(file, { baseDir: BaseDirectory.AppLocalData });
	if (!fileExists) return null;

	try {
		const raw = await readTextFile(file, { baseDir: BaseDirectory.AppLocalData });
		const parsed = JSON.parse(raw) as CachedHomework<T>;

		Object.keys(parsed.data as any).forEach((day) => {
			(parsed.data as any)[day].forEach((item: any) => {
				if (item.dueDate) item.dueDate = new Date(item.dueDate);
				if (item.givenDate) item.givenDate = new Date(item.givenDate);
			});
		});

		return parsed;
	} catch {
		return null;
	}
}
