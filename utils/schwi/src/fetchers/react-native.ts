import type { Fetcher } from "../factory";
import { fetchResponseToHttpResponse, httpRequestToFetchInit } from "./adapters/fetch";

export const fetcher: Fetcher = async (req) => {
	let rnfetch = fetch;

	try {
		const exports = await import("react-native-real-fetch");
		rnfetch = exports.fetch;
	} catch {
		// not available, let's keep the react native one
	}

	const res = await rnfetch(req.url.href, httpRequestToFetchInit(req));
	return fetchResponseToHttpResponse(res);
};
