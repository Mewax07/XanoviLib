// @ts-expect-error : not typed
import Agent from "undici/lib/dispatcher/agent.js";

// @ts-expect-error: undici is not typed with this type of import.
import { fetch as _fetch } from "undici/lib/web/fetch/index.js";

const undiciFetch = _fetch as typeof globalThis.fetch;

import type { Fetcher } from "../factory";
import { fetchResponseToHttpResponse, httpRequestToFetchInit } from "./adapters/fetch";

export const fetcher: Fetcher = async (req) => {
	const agent = new Agent({ connect: { rejectUnauthorized: !req.unauthorizedTLS } });

	const res = await undiciFetch(req.url.href, {
		...httpRequestToFetchInit(req),
		// @ts-expect-error : not typed
		dispatcher: agent,
	});

	return fetchResponseToHttpResponse(res);
};
