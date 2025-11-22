import { useEffect, useState } from "react";
import { usePronoteConnected } from "../../../api/homepage";

export const Home = () => {
	const pronote = usePronoteConnected();
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		if (!pronote) return;

		const fetchData = async () => {
			try {
				const homepageInfo = await pronote.homepage();
				setData(homepageInfo);
			} catch (err) {
				console.error("Erreur Home:", err);
			}
		};

		fetchData();
	}, [pronote]);

	return <div>{data ? "Home loaded ✔️" : "Chargement..."}</div>;
};

export default Home;
