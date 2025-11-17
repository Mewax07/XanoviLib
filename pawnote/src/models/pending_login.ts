import { AccountSecurityDoubleAuth } from "../api/account_security";
import { TypeActionIHMSecurisationCompte } from "../api/models/TypeActionIHMSecurisationCompte";
import { TypeModeGestionDoubleAuthentification } from "../api/models/TypeModeGestionDoubleAuthentification";
import { Authentication } from "./authentication";
import { SourceTooLongError } from "./errors";
import { Parameters } from "./params";
import { PasswordRules } from "./password_rules";
import { Session } from "./session";

export class PendingLogin {
	/** @internal */
	public _mode?: TypeModeGestionDoubleAuthentification;

	/** @internal */
	public _password?: string;

	/** @internal */
	public _pin?: string;

	/** @internal */
	public _source?: string;

	/** @internal */
	public constructor(
		/** @internal */
		public readonly _session: Session,
		/** @internal */
		public readonly _parameters: Parameters,
		/** @internal */
		public readonly _authentication: Authentication,
	) {}

	public get shouldCustomPassword(): boolean {
		return this._authentication.securityActions.includes(
			TypeActionIHMSecurisationCompte.AIHMSC_PersonnalisationMotDePasse,
		);
	}

	public get shouldCustomDoubleAuthMode(): boolean {
		return this._authentication.securityActions.includes(TypeActionIHMSecurisationCompte.AIHMSC_ChoixStrategie);
	}

	public get shouldEnterPin(): boolean {
		return this._authentication.securityActions.includes(
			TypeActionIHMSecurisationCompte.AIHMSC_SaisieCodePINetSource,
		);
	}
	public get shouldRegisterSource(): boolean {
		return this._authentication.securityActions.includes(
			TypeActionIHMSecurisationCompte.AIHMSC_SaisieSourcePourNotifSeulement,
		);
	}

	public get hasPinMode(): boolean {
		return this._authentication.modes.includes(TypeModeGestionDoubleAuthentification.MGDA_SaisieCodePIN);
	}

	public usePinMode(pin: string): void {
		if (!this.hasPinMode) throw new Error("this mode is not enabled");

		this._pin = pin;
		this._mode = TypeModeGestionDoubleAuthentification.MGDA_SaisieCodePIN;
	}

	public get hasIgnoreMode(): boolean {
		return this._authentication.modes.includes(TypeModeGestionDoubleAuthentification.MGDA_Inactive);
	}

	public useIgnoreMode(): void {
		if (!this.hasIgnoreMode) throw new Error("this mode is not enabled");

		this._mode = TypeModeGestionDoubleAuthentification.MGDA_Inactive;
	}

	public get hasNotificationMode(): boolean {
		return this._authentication.modes.includes(TypeModeGestionDoubleAuthentification.MGDA_NotificationSeulement);
	}

	public useNotificationMode(): void {
		if (!this.hasNotificationMode) throw new Error("this mode is not enabled");

		this._mode = TypeModeGestionDoubleAuthentification.MGDA_NotificationSeulement;
	}

	public get password(): PasswordRules {
		return this._authentication.password;
	}

	public async validate(password: string): Promise<boolean> {
		const ok = await new AccountSecurityDoubleAuth(this._session).sendPasswordCheck(password);

		if (ok) this._password = password;
		return ok;
	}

	public async verify(pin: string): Promise<boolean> {
		const ok = await new AccountSecurityDoubleAuth(this._session).sendPinVerify(pin);

		if (ok) this._pin = pin;
		return ok;
	}

	public async source(source: string): Promise<boolean> {
		if (source.length > 30) throw new SourceTooLongError(30);

		this._source = source;

		return new AccountSecurityDoubleAuth(this._session).sendSourceAlreadyKnown(source);
	}
}
