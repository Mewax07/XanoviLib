import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function ask(question: string): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	return new Promise((resolve) =>
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer.trim());
		}),
	);
}

async function main() {
	const nameInput = await ask("Nom de la fonction (ex: getUser) :");
	const addSignature = (await ask("Voulez-vous un onglet signature ? (o/N) :")).toLowerCase() === "o";
	let onglet = 0;
	if (addSignature) {
		onglet = parseInt(await ask("Numéro de l'onglet pour la signature :"), 10);
		if (isNaN(onglet)) onglet = 7;
	}

	const addResponseSignature = (await ask("Voulez-vous une réponse avec signature ? (o/N) :")).toLowerCase() === "o";

	const nameLower = nameInput.toLowerCase();
	const nameUpper = capitalize(nameInput);

	const baseDir = path.join("pawnote", "src", "api", nameLower);
	if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

	const indexPath = path.join(baseDir, "index.ts");
	const requestPath = path.join(baseDir, "request.ts");
	const responsePath = path.join(baseDir, "response.ts");

	const indexContent = `import { Child, Student, User } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { ${nameUpper}Request${addSignature ? ", " + nameUpper + "RequestSignature" : ""} } from "./request";
import { ${nameUpper}Model${addResponseSignature ? ", " + nameUpper + "ModelSignature" : ""} } from "./response";

export type ${nameUpper}Response = ResponseFunctionWrapper<${nameUpper}Model${addResponseSignature ? ", " + nameUpper + "ModelSignature" : ""}>;

export class ${nameUpper} extends RequestFunction<${nameUpper}Request${addSignature ? ", " + nameUpper + "RequestSignature" : ""}> {
    private static readonly name = "";

	private readonly user: User;
    private readonly decoder: any;

    constructor(
        user: User,
        private readonly resource: Student | Child,
    ) {
        super(user.session, ${nameUpper}.name);
        this.user = user;
        this.decoder = new ResponseFunction(this.session, ${nameUpper}Model${addResponseSignature ? ", " + nameUpper + "ModelSignature" : ""});
    }

	public async send(): Promise<${nameUpper}Response> {
		const response = await this.execute(
			{
			},
			{
				${addSignature ? "onglet: " + onglet + "," : ""}
				membre: this.resource instanceof Child
					? {
						G: this.resource.kind,
						N: this.resource.id,
					}
					: void 0,
			}
		);

		return this.decoder.decode(response);
	}
}
`;

	let requestContent = `export interface ${nameUpper}Request {
}
`;

	if (addSignature) {
		requestContent += `\nexport interface ${nameUpper}RequestSignature {
	onglet: ${onglet};
    membre?: {
		G: number;
		N: string;
	};
}
`;
	}

	let responseContent = `export class ${nameUpper}Model {
}
`;

	if (addResponseSignature) {
		responseContent += `\nexport interface ${nameUpper}ModelSignature {
}
`;
	}

	fs.writeFileSync(indexPath, indexContent);
	fs.writeFileSync(requestPath, requestContent);
	fs.writeFileSync(responsePath, responseContent);

	console.log(`API function "${nameUpper}" créée dans ${baseDir}`);
}

main().catch((err) => console.error("Error:", err));
