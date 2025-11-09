import { Authentication } from "../authentication";
import { Parameters } from "../params";
import { Session } from "../session";
import { UserParameters } from "../user_params";

export abstract class User {
	/** @internal */
	protected constructor(
		/** @internal */
		public readonly user: UserParameters,
		/** @internal */
		public readonly session: Session,
		/** @internal */
		public readonly parameters: Parameters,
		/** @internal */
		public readonly authentication: Authentication,
	) {}

	public get username(): string {
		return this.authentication.username;
	}

	public get token(): string {
		return this.authentication.token;
	}

	public get uuid(): string {
		return this.authentication.uuid;
	}

	public get id(): string {
		return this.user.resource.id;
	}

	public get name(): string {
		return this.user.resource.name;
	}

	public get kind(): number {
		return this.user.resource.kind;
	}
}
