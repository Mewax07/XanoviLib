import { BaseDirectory, exists, mkdir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

export interface CachedSchedule<T> {
	savedAt: number;
	data: T;
}

const folder = "schedule";
const file = "schedule\\cache.json";

export async function saveSchedule<T>(data: T) {
	const folderExists = await exists(folder, { baseDir: BaseDirectory.AppLocalData });
	if (!folderExists) {
		await mkdir(folder, { baseDir: BaseDirectory.AppLocalData });
	}

	const payload: CachedSchedule<T> = {
		savedAt: Date.now(),
		data,
	};

	await writeTextFile(file, JSON.stringify(payload), { baseDir: BaseDirectory.AppLocalData });
}

export async function loadSchedule<T>(): Promise<CachedSchedule<T> | null> {
	const fileExists = await exists(file, { baseDir: BaseDirectory.AppLocalData });
	if (!fileExists) return null;

	try {
		const raw = await readTextFile(file, { baseDir: BaseDirectory.AppLocalData });
		const parsed = JSON.parse(raw) as CachedSchedule<T>;

		Object.keys(parsed.data as any).forEach((day) => {
			(parsed.data as any)[day].forEach((course: any) => {
				course.startDate = new Date(course.startDate);
				course.endDate = new Date(course.endDate);
			});
		});

		return parsed;
	} catch {
		return null;
	}
}
