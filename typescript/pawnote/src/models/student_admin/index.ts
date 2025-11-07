import { Child } from "../user/parent";
import { Student } from "../user/student";
import { User } from "../user/user";

export class StudentAdministration {
	/** @internal */
	public constructor(
		private readonly _user: User,
		private readonly _sub?: Child,
	) {}

	private get _resource(): Student | Child {
		if (this._user instanceof Student) return this._user;
		else return this._sub!;
	}

	public async getHomepage(weekNumber?: number) {
		return 0;
	}
}
