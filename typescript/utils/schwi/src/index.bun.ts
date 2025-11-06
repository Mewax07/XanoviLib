const kIsClosedPromise = Symbol.for("nodejs.webstream.isClosedPromise");
const OriginalReadableStream = globalThis.ReadableStream;

// @ts-expect-error : monkey patching
globalThis.ReadableStream = function ReadableStream(...args) {
	const instance = Reflect.construct(OriginalReadableStream, args, new.target);
	instance[kIsClosedPromise] = Promise.withResolvers();
	return instance;
};

globalThis.ReadableStream.prototype = OriginalReadableStream.prototype;
Object.setPrototypeOf(globalThis.ReadableStream, OriginalReadableStream);

// @ts-expect-error: undici is not typed with this type of import.
import { Headers } from "undici/lib/web/fetch/headers.js";

import { HeaderMap, kHeaders } from "./headers";
HeaderMap[kHeaders] = Headers;
export { HeaderMap };

import { factory } from "./factory";
import { fetcher } from "./fetchers/undici";

export { HeaderKeys } from "./headers";
export { HttpRequest, HttpRequestMethod, HttpRequestRedirection } from "./request";
export { HttpResponse } from "./response";

export const send = factory(fetcher);
