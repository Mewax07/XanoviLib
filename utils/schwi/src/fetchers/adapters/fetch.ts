import { HeaderMap } from "../../headers";
import { HttpRequest } from "../../request";
import { HttpResponse } from "../../response";

export const httpRequestToFetchInit = (req: HttpRequest): RequestInit => ({
	body: req.body,
	credentials: "omit",
	headers: req.headers.toNativeHeaders(),
	method: req.method,
	redirect: req.redirection,
});

export const fetchResponseToHttpResponse = (res: Response): HttpResponse =>
	new HttpResponse(
		res.url,
		res.status,
		new HeaderMap(res.headers),
		async () => res.text(),
		async () => res.arrayBuffer(),
	);
