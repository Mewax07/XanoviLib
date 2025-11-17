import { General } from "../api/function/response";
import { FunctionParametersResponse } from "../api/function";

export class Parameters {
	constructor(private readonly _raw: FunctionParametersResponse) {}

	public get navigatorIdentifier(): string | null {
		return this._raw.data.navigatorIdentifier;
	}

	public get general(): General {
		return this._raw.data.general;
	}
}
