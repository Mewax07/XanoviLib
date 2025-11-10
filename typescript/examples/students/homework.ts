import { StudentConnector } from "./base";

async function main() {
    const connector = new StudentConnector(false); // true pour demo
    const student = await connector.connect();

    const admin = student.administration;

    const homepage = await admin.getHomeworkSinceDate();
    console.log("test", homepage.homework[0]);
}

main().catch(console.error);
