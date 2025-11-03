import { HttpRequest } from "./request";
import { HttpResponse } from "./response";

export type Fetcher = (req: HttpRequest) => Promise<HttpResponse>;

export const factory = (fetcher: Fetcher) => {
	return (req: HttpRequest): Promise<HttpResponse> => {
		return fetcher(req);
	};
};
