import { StudentConnector } from "./base";

async function main() {
	const connector = new StudentConnector(true); // true pour demo
	const student = await connector.connect();

	const admin = student.administration;

	const homepage = await admin.getHomeworkSinceDate(new Date());
	const course = homepage.entries[homepage.entries.length - 1];
	console.log(course.assignment.id);
	console.log(course.assignment.subject.label);
	console.log(course.assignment.isCompleted);
	await course.assignment.toggleDone();
	console.log(course.assignment.isCompleted);
	console.log(course);
}

main().catch(console.error);
