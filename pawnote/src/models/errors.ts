export class AccessDeniedError extends Error {
	constructor() {
		super("You do not have access to this area or your authorizations are insufficient");
		this.name = "AccessDeniedError";
	}
}

export class AccountDisabledError extends Error {
	constructor() {
		super("Your account has been deactivated");
		this.name = "AccountDisabledError";
	}
}

export class AuthenticateError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AuthenticateError";
	}
}

export class BadCredentialsError extends Error {
	constructor() {
		super("Unable to resolve the challenge, make sure the credentials or token are corrects");
		this.name = "BadCredentialsError";
	}
}

export class BusyPageError extends Error {
	constructor() {
		super("The site is temporarily unavailable");
		this.name = "BusyPageError";
	}
}

export class PageUnavailableError extends Error {
	constructor() {
		super("The requested page does not exist");
		this.name = "PageUnavailableError";
	}
}

export class RateLimitedError extends Error {
	constructor() {
		super("You've been rate-limited");
		this.name = "RateLimitedError";
	}
}

export class ServerSideError extends Error {
	constructor(message = "An error occurred, server-side") {
		super(message);
		this.name = "ServerSideError";
	}
}

export class SessionExpiredError extends Error {
	constructor() {
		super("The session has expired");
		this.name = "SessionExpiredError";
	}
}

export class SuspendedIpError extends Error {
	constructor() {
		super("Your IP address has been suspended");
		this.name = "SuspendedIpError";
	}
}

export class UnreachableError extends Error {
	constructor(fn: string) {
		super(`Unhandled code reached in "${fn}" function (pawnote), please report this issue`);
		this.name = "UnreachableError";
	}
}
