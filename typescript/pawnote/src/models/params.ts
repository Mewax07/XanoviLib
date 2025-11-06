import { FonctionParametresResponse } from "../api/function";

export class Parameters {
	constructor(private readonly _raw: FonctionParametresResponse) {}

	public get navigatorIdentifier(): string | null {
		return this._raw.data.navigatorIdentifier;
	}
}
