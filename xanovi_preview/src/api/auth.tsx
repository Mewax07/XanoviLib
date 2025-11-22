import { usePronote } from "../context/Pronote";
import Xanovi from "../lib/xanovi_lib";
const pawnote = Xanovi.pronote;

export const usePronoteAuth = () => {
	const { setPronoteData } = usePronote();

	const authStudent = async (link: URL) => {
		try {
			const instance = pawnote.Instance.fromURL(link);
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
	};

	return { authStudent };
};
