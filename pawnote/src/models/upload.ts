import { bytesToHex } from "@noble/ciphers/utils.js";
import { FormDataFile, HeaderKeys, HttpRequest, HttpRequestMethod, send } from "schwi";
import { UA } from "~p0/core";
import { WhoCallMe } from "~t0/index";
import { Session } from "./session";
import { UploadFailedError } from "./errors";

export class RequestUpload {
	public readonly id = `selectfile_1_${Date.now()}`;

	public constructor(
		private readonly session: Session,
		private readonly functionName: string,
		private readonly file: FormDataFile,
		private readonly fileName: string,
	) {}

	@WhoCallMe
	public async execute(): Promise<void> {
		this.session.api.order++;
		const order = bytesToHex(this.session.aes.encrypt(this.session.api.order));

		const form = new FormData();
		form.append(this.session.api.properties.orderNumber, order);
		form.append(this.session.api.properties.session, String(this.session.homepage.id));
		form.append(this.session.api.properties.requestId, this.functionName);
		form.append("idFichier", this.id);
		form.append("md5", "");

		form.append("files[]", this.file as any, this.fileName);

		const url = `${this.session.url}/uploadfilesession/${this.session.homepage.webspace}/${this.session.homepage.id}`;

		const textBody = await new Response(form).text();
		const contentType = `multipart/form-data; boundary=${textBody.split("\n")[0].slice(2)}`;

		const headers: Record<string, string> = {
			[HeaderKeys.CONTENT_TYPE]: contentType,
			["Content-Disposition"]: `attachment; filename="${encodeURI(this.fileName)}"`,
			[HeaderKeys.USER_AGENT]: UA,
		};

		let state = 3; // Set to UPLOADING by default.

		while (state === 3) {
			const builder = new HttpRequest.Builder(url).setMethod(HttpRequestMethod.POST);

			for (const [key, value] of Object.entries(headers)) {
				builder.setHeader(key, value);
			}

			(builder as any).body = textBody;

			const request = builder.build();
			const response = await send(request);

			const json = await response.toJSON<{ etat: number }>();
			state = json.etat;
		}

		this.session.api.order++;

		if (state === 0 || state === 2) {
			// 0 = UNKNOWN, 2 = ERROR
			throw new UploadFailedError();
		}
	}
}
