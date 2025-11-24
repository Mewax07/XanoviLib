import { StudentConnector } from "./base";

async function main() {
	const connector = new StudentConnector(true); // true pour demo
	const student = await connector.connect();

	const admin = student.administration;

	const homepage = await admin.getHomeworkSinceDate(new Date());
	console.log(homepage._raw.content.data.homeworkList[0]);
	console.log(homepage._raw.resource.data.resourcesList.listOfContents[0]);
	console.log(homepage._raw.resource.data.resourcesList.listResources[0]);
}

main().catch(console.error);