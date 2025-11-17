import Xanovi from "../../src";
const { pronote: pawnote } = Xanovi;

import fs from "node:fs/promises";
import path from "node:path";
import { Student } from "~p0/models";

const AUTH_FILE = path.join(__dirname, "./auth.json");

export interface AuthData {
	url: string;
	username: string;
	token?: string;
	uuid?: string;
}

export class StudentConnector {
	private authData: AuthData;
	private demo: boolean;

	constructor(demo = false) {
		this.demo = demo;
		this.authData = {} as AuthData;
	}

	private async loadAuth(): Promise<AuthData> {
		try {
			const data = await fs.readFile(AUTH_FILE, "utf-8");
			return JSON.parse(data);
		} catch {
			throw new Error(`Impossible de lire ${AUTH_FILE}. Assure-toi qu'il existe avec un contenu valide.`);
		}
	}

	private async saveAuth() {
		await fs.writeFile(AUTH_FILE, JSON.stringify(this.authData, null, 4), "utf-8");
		console.info("[*] Auth data saved!");
	}

	public async connect(): Promise<Student> {
		this.authData = await this.loadAuth();

		let url: string;
		let username: string;
		let token: string | undefined;
		let uuid: string | undefined;

		if (this.demo) {
			url = "https://demo.index-education.net/pronote/eleve.html";
			username = "demonstration";
			console.info("[*] Mode démonstration activé.");
		} else {
			url = this.authData.url;
			username = this.authData.username;
			token = this.authData.token;
			uuid = this.authData.uuid;
			console.info("[*] Mode authentification réelle activé.");
		}

		const instance = pawnote.Instance.fromURL(url);
		const portal = new pawnote.StudentLoginPortal(instance);

		console.info(`[*] Authenticating to ${url}...`);

		let auth;
		if (this.demo) {
			auth = await portal.credentials(username, "pronotevs");
		} else if (token && uuid) {
			auth = await portal.token(username, token, uuid);
		} else {
			throw new Error("token or uuid is missing and demo is disabled");
		}

		const student = await portal.finish(auth);

		console.info("[*] Connected successfully!");
		console.info("[*] Next token:", student.token);

		if (!this.demo) {
			this.authData.token = student.token;
			await this.saveAuth();
		}

		return student;
	}
}
