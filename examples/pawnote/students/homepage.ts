import { StudentConnector } from "./base";

async function main() {
	const connector = new StudentConnector(true); // true pour demo
	const student = await connector.connect();

	const admin = student.administration;

	const homepage = await admin.getHomepage();
	console.log("[*] Courses:", homepage.courses[0]);
	console.log("[*] Actualities:", homepage.actualities!.actualitiesList[0]);
	console.log("[*] Agenda:", homepage.agenda.eventsList[0]);
	console.log("[*] Notes:", homepage.notes.listAssignments[0]);
}

main().catch(console.error);
