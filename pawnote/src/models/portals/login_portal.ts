import { deserialize } from "~d0/deserialize";
import { HeaderKeys, HttpRequest, HttpRequestRedirection, send } from "~s0/index.bun";
import { AccountSecurityDoubleAuth } from "../../api/account_security";
import { Authentification } from "../../api/authentification";
import { FunctionParameters } from "../../api/function";
import { Identification, IdentificationMode } from "../../api/identification";
import { UserSetting } from "../../api/user_setting";
import { UA } from "../../core";
import { Authentication } from "../authentication";
import { BusyPageError, PageUnavailableError, SuspendedIpError } from "../errors";
import { Identity } from "../identify";
import { Instance } from "../instance";
import { Parameters } from "../params";
import { PendingLogin } from "../pending_login";
import { HomepageSession, Session } from "../session";
import { UserParameters } from "../user_params";
import { Webspace } from "../webspace";

export abstract class LoginPortal {
	/** @internal */
	protected constructor(protected readonly _instance: Instance) {}

	/** @internal */
	protected async _credentials(
		webspace: Webspace,
		username: string,
		password: string,
		deviceUUID: string,
		navigatorIdentifier: string | null,
	): Promise<PendingLogin> {
		const instance = await this._instance.getInformation();
		const homepage = await this._getWebspaceHomepageSession(webspace);

		const session = new Session(instance, homepage, this._instance.base);

		const parameters = new Parameters(await new FunctionParameters(session).send(navigatorIdentifier));

		const identity = new Identity(
			await new Identification(session).send(username, deviceUUID, IdentificationMode.Credentials),
		);

		const key = identity.createMiddlewareKey(username, password);
		const challenge = identity.solveChallenge(session, key);

		const authentication = new Authentication(
			await new Authentification(session).send(challenge),
			identity.username ?? username,
			deviceUUID,
		);

		authentication.switchDefinitiveKey(session, key);

		if (authentication.hasSecurityActions) {
			return this._token(webspace, username, authentication.token, deviceUUID, parameters.navigatorIdentifier);
		}

		return new PendingLogin(session, parameters, authentication);
	}

	/** @internal */
	protected async _token(
		webspace: Webspace,
		username: string,
		token: string,
		deviceUUID: string,
		navigatorIdentifier: string | null,
	): Promise<PendingLogin> {
		const instance = await this._instance.getInformation();
		const homepage = await this._getWebspaceHomepageSession(webspace, {
			appliMobile: "1",
		});

		const session = new Session(instance, homepage, this._instance.base);

		const parameters = new Parameters(await new FunctionParameters(session).send(navigatorIdentifier));

		const identity = new Identity(
			await new Identification(session).send(username, deviceUUID, IdentificationMode.Token),
		);

		const key = identity.createMiddlewareKey(username, token);
		const challenge = identity.solveChallenge(session, key);

		const authentication = new Authentication(
			await new Authentification(session).send(challenge),
			identity.username ?? username,
			deviceUUID,
		);

		authentication.switchDefinitiveKey(session, key);

		return new PendingLogin(session, parameters, authentication);
	}

	/** @internal */
	protected async _finish(login: PendingLogin): Promise<UserParameters> {
		if (
			login.shouldCustomDoubleAuthMode ||
			login.shouldCustomPassword ||
			login.shouldEnterPin ||
			login.shouldRegisterSource
		) {
			const token = await new AccountSecurityDoubleAuth(login._session).save(
				login._mode,
				login._password,
				login._pin,
				login._source,
			);

			if (token) login._authentication.token = token;
		}

		return new UserParameters(await new UserSetting(login._session).send());
	}

	/** @internal */
	private async _getWebspaceHomepageSession(
		webspace: Webspace,
		cookies: Record<string, string> = {},
	): Promise<HomepageSession> {
		const params = new URLSearchParams();

		params.set("fd", "1");

		params.set("login", "true");

		params.set("bydlg", "A6ABB224-12DD-4E31-AD3E-8A39A1C2C335");
		const url = this._instance.base + "/" + Webspace.toMobilePath(webspace) + "?" + params.toString();

		const request = new HttpRequest.Builder(url)
			.setRedirection(HttpRequestRedirection.MANUAL)
			.setHeader(HeaderKeys.USER_AGENT, UA)
			.setAllCookies(cookies)
			.build();

		const response = await send(request);
		let html = await response.toString();

		if (html.includes("Votre adresse IP est provisoirement suspendue")) {
			throw new SuspendedIpError();
		} else if (html.includes("Le site n'est pas disponible")) {
			throw new PageUnavailableError();
		} else if (html.includes("Le site est momentanément indisponible")) {
			throw new BusyPageError();
		}

		html = html.replace(/ /gu, "").replace(/\n/gu, "");

		const from = "Start(";
		const to = ")}catch";

		const arg = html.substring(html.indexOf(from) + from.length, html.indexOf(to));

		const json = JSON.parse(arg.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/gu, '"$2": ').replace(/'/gu, '"'));

		return deserialize(HomepageSession, json);
	}
}
