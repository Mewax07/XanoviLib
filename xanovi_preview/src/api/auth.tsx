import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { usePronote } from "../context/Pronote";
import Xanovi from "../lib/xanovi_lib";
const pawnote = Xanovi.pronote;

export const usePronoteAuth = () => {
	const { setPronoteData } = usePronote();

	const loadAuthFile = async () => {
		try {
			const data = await readTextFile("auth.json", { baseDir: BaseDirectory.AppLocalData });
			return JSON.parse(data) as {
				uuid: string;
				url: string;
				kind: number;
				token: string;
				username: string;
			};
		} catch (error) {
			console.error("Erreur lors de la lecture de auth.json :", error);
			return null;
		}
	};

	const saveAuthFile = async (user: { uuid: string; username: string; token: string; url: string; kind: number }) => {
		try {
			const data = JSON.stringify(user, null, 2);
			await writeTextFile("auth.json", data, { baseDir: BaseDirectory.AppLocalData });
			console.log("auth.json sauvegardé !");
		} catch (error) {
			console.error("Erreur lors de la sauvegarde de auth.json :", error);
		}
	};

	const authStudent = async (demo: boolean) => {
		if (demo) {
			try {
				const instance = pawnote.Instance.fromURL("https://demo.index-education.net/pronote/eleve.html");
				const portal = new pawnote.StudentLoginPortal(instance);
				const authData = await portal.credentials("demonstration", "pronotevs");
				const student = await portal.finish(authData);
				const admin = student.administration;

				setPronoteData({
					instance,
					portal,
					auth: authData,
					user: student,
					admin,
				});

				return student;
			} catch (error) {
				console.error("Erreur dans authStudent:", error);
				throw error;
			}
		} else {
			try {
				const auth = await loadAuthFile();
				if (!auth) throw new Error("Impossible de lire auth.json");

				const instance = pawnote.Instance.fromURL(auth.url);
				const portal = new pawnote.StudentLoginPortal(instance);

				const authData = await portal.token(auth.username, auth.token, auth.uuid);
				const student = await portal.finish(authData);
				const admin = student.administration;

				setPronoteData({
					instance,
					portal,
					auth: authData,
					user: student,
					admin,
				});

				await saveAuthFile({
					uuid: student.uuid,
					username: auth.username,
					token: student.token,
					url: auth.url,
					kind: auth.kind,
				});

				return student;
			} catch (error) {
				console.error("Erreur dans authStudent:", error);
				throw error;
			}
		}
	};

	return { authStudent };
};
