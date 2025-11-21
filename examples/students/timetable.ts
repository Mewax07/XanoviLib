import { StudentConnector } from "./base";

async function main() {
	const connector = new StudentConnector(true); // true pour demo
	const student = await connector.connect();

	const admin = student.administration;

	const timetable = await admin.getTimetableFromWeek();
	console.log("[*] Courses:", timetable.entries);
}

main().catch(console.error);
