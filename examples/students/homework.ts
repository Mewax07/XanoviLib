import { StudentConnector } from "./base";

async function main() {
	const connector = new StudentConnector(true); // true pour demo
	const student = await connector.connect();

	const admin = student.administration;

	const homepage = await admin.getHomeworkFromIntervals(40, 52);
	console.log("test", homepage.homework[homepage.homework.length - 1]);
}

main().catch(console.error);