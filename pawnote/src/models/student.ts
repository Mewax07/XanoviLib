import { Authentication } from "./authentication";
import { Parameters } from "./params";
import { Session } from "./session";

export class Student {
	public constructor(
		private readonly session: Session,
		private readonly parameters: Parameters,
		private readonly authentication: Authentication,
	) {}
}
