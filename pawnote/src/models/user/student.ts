import { Authentication } from "../authentication";
import { Parameters } from "../params";
import { Session } from "../session";
import { UserParameters } from "../user_params";
import { User } from "./user";

export class Student extends User {
	public constructor(
		user: UserParameters,
		session: Session,
		parameters: Parameters,
		authentication: Authentication,
	) {
		super(user, session, parameters, authentication);
	}
}
