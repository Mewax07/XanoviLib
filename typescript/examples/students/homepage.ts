import Xanovi from "../../src";
const { pronote: pawnote } = Xanovi;

import fs from "node:fs/promises";
import path from "node:path";

const AUTH_FILE = path.join(__dirname, "./auth.json");
const DEMO = false;

async function loadAuth() {
	try {
		const data = await fs.readFile(AUTH_FILE, "utf-8");
		return JSON.parse(data);
	} catch {
		throw new Error(`Impossible de lire ${AUTH_FILE}. Assure-toi qu'il existe avec un contenu valide.`);
	}
}

async function saveAuth(authData: any) {
	await fs.writeFile(AUTH_FILE, JSON.stringify(authData, null, 4), "utf-8");
	console.info("[*] Auth data saved!");
}

async function main() {
	const authData = await loadAuth();

	let url: string;
	let username: string;
	let token: string | null = null;
	let uuid: string | null = null;

	if (DEMO) {
		url = "https://demo.index-education.net/pronote/parent.html";
		username = "demonstration";
		console.info("[*] Mode démonstration activé.");
	} else {
		url = authData.url;
		username = authData.username;
		token = authData.token;
		uuid = authData.uuid;
		console.info("[*] Mode authentification réelle activé.");
	}

	const instance = pawnote.Instance.fromURL(url);
	const portal = new pawnote.StudentLoginPortal(instance);

	console.info(`[*] Authenticating to ${url}...`);

	let auth;
	if (DEMO) {
		auth = await portal.credentials(username, "pronotevs");
	} else if (token && uuid) {
		auth = await portal.token(username, token, uuid);
	} else {
		throw new Error("token or uuid is missing and demo is diabled");
	}

	const student = await portal.finish(auth);

	console.info("[*] Connected successfully!");
	console.info("[*] Next token:", student.token);

	if (!DEMO) {
		authData.token = student.token;
		await saveAuth(authData);
	}

	const homepage = await student.administration.getHomepage();
	console.log("[*] Courses:", homepage.courses);
	console.log("[*] Actualities:", homepage.actualities);
	console.log("[*] Agenda:", homepage.agenda);
	console.log("[*] Notes:", homepage.notes);

	const timetable = await student.administration.getTimetableFromWeek();
	console.log("[*] Timetable", timetable);
}

main().catch((err) => {
	console.error("Error:", err);
	process.exit(1);
});
