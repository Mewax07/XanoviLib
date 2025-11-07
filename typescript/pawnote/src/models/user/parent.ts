import { InnerResource } from "../../api/user_setting/response";
import { Authentication } from "../authentication";
import { Parameters } from "../params";
import { Session } from "../session";
import { StudentAdministration } from "../student_admin";
import { UserParameters } from "../user_params";
import { User } from "./user";

export class Child {
	public readonly administration: StudentAdministration;

	/** @internal */
	public constructor(
		/** @internal */
		public readonly parent: Parent,
		private readonly _raw: InnerResource,
	) {
		this.administration = new StudentAdministration(parent, this);
	}

	public get id(): string {
		return this._raw.id;
	}

	public get name(): string {
		return this._raw.name;
	}

	public get kind(): number {
		return this._raw.kind;
	}
}

export class Parent extends User {
	public readonly children: Array<Child>;

	public constructor(user: UserParameters, session: Session, parameters: Parameters, authentication: Authentication) {
		super(user, session, parameters, authentication);
		this.children = this.user.resource.inner!.map((item) => new Child(this, item));
	}
}
