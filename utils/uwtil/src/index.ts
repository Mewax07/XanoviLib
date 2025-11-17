import fs from "fs";
import path from "path";

export type ConfigProfile = Record<string, string | boolean>;

let activeConfig: ConfigProfile = {};

export function loadConfig(profile: string): ConfigProfile {
	const configPath = path.resolve(".config");
	const content = fs.readFileSync(configPath, "utf-8");

	const lines = content.split(/\r?\n/);
	const profiles: Record<string, ConfigProfile> = {};
	let current: string | null = null;

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;

		const sectionMatch = trimmed.match(/^\[(.+)]$/);
		if (sectionMatch) {
			current = sectionMatch[1];
			profiles[current] = {};
		} else if (current && (trimmed.includes("=") || trimmed.includes(":"))) {
			const [key, value] = trimmed.split(/[=:]/).map((v) => v.trim());
			profiles[current][key] = value === "true" ? true : value === "false" ? false : value;
		}
	}

	const cfg = profiles[profile];
	if (!cfg) throw new Error(`Config profile "${profile}" not found in .config`);

	activeConfig = cfg;
	console.log(cfg);
	return cfg;
}

export function getConfig(): ConfigProfile {
	return activeConfig;
}

// Décoration
export function WhoCallMe(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	const original = descriptor.value;

	descriptor.value = function (...args: any[]) {
		const config = getConfig();
		if (!config.whocallme) return original.apply(this, args);

		const err = new Error();
		const stack = err.stack?.split("\n") || [];

		const callerLine = stack[3] || stack[2] || "Stack info not available";

		const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
		if (match) {
			const [, file, line, col] = match;
			console.log(`WhoCallMe -> appelé depuis ${file}:${line}:${col}`);
		} else {
			console.log(`WhoCallMe -> ${callerLine.trim()}`);
		}

		return original.apply(this, args);
	};

	return descriptor;
}
