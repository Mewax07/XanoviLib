import "./index.css";

import Navbar from "./components/Navbar";

/*
import Xanovi from "../../dist";
const pawnote = Xanovi.pronote;

async function auth() {
	const instance = pawnote.Instance.fromURL("https://demo.index-education.net/pronote/eleve.html");
	const portal = new pawnote.StudentLoginPortal(instance);
	const auth = await portal.credentials("demonstration", "pronotevs");

	const student = await portal.finish(auth);
	const admin = student.administration;

	const timetable = await admin.getTimetableFromWeek();
	console.log("[*] Courses:", timetable.entries);

	console.info(`[*] authenticating to ${instance.base}...`);
}
*/

function App() {
	return (
		<>
			<Navbar></Navbar>
			<section className="main-ctn"></section>
		</>
	);
}

export default App;
