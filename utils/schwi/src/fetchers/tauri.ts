import type { Fetcher } from "../factory";

import { fetch as tauriFetch } from "@tauri-apps/plugin-http";
import { fetchResponseToHttpResponse, httpRequestToFetchInit } from "./adapters/fetch";

export const fetcher: Fetcher = async (req) => {
	const res = await tauriFetch(req.url.href, httpRequestToFetchInit(req));
	return fetchResponseToHttpResponse(res);
};
