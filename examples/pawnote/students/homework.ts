import { StudentConnector } from "./base";

async function main() {
	const connector = new StudentConnector(false); // true pour demo
	const student = await connector.connect();

	const admin = student.administration;

	const homepage = await admin.getHomeworkSinceDate(new Date());
	const course = homepage.entries[homepage.entries.length - 1];
	console.log(course.id);
	console.log(course.subject.label);
	console.log(course.isCompleted);
	await course.toggleDone();
	console.log(course.isCompleted);
}

main().catch(console.error);
