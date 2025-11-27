import { useState } from "react";
import "./css/index.css";

import { usePronoteAuth } from "./api/auth";
import Navbar from "./components/Navbar";
import Workspace from "./components/Workspace";
import { usePronote } from "./context/Pronote";

function App() {
	const { authStudent } = usePronoteAuth();

	const { user } = usePronote();
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		setLoading(true);
		try {
			const student = await authStudent(false);
			student.administration.startPresenceInterval();
			console.log("Connection success:", student?.name);
		} catch (err) {
			console.error("Error while login :", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Navbar />
			<section className="main-ctn">
				{!user ? (
					<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
						<button onClick={handleLogin} disabled={loading}>
							{loading ? "Connexion..." : "Se connecter à Pronote"}
						</button>
					</div>
				) : (
					<Workspace />
				)}
			</section>
		</>
	);
}

export default App;
