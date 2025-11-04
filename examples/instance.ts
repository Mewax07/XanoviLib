import Xanovi from "../src";
const { pronote: pawnote } = Xanovi;

const instance = pawnote.Instance.fromURL("https://demo.index-education.net/pronote/eleve.html");

const portal = new pawnote.StudentLoginPortal(instance);
const auth = await portal.credentials("demonstration", "pronotevs");

console.info(`[*] authenticating to ${instance.base}...`);

if (auth.shouldCustomPassword) {
	console.info("[*] you have to custom the password, make sure to respect the following rules.");
	console.info("\t- max:", auth.password.max);
	console.info("\t- min:", auth.password.min);

	if (auth.password.withAtLeastOneLetter) console.info("\t- with at least one letter");

	if (auth.password.withAtLeastOneNumericCharacter) console.info("\t- with at least one numeric character");

	if (auth.password.withAtLeastOneSpecialCharacter) console.info("\t- with at least one special character");

	if (auth.password.withLowerAndUpperCaseMixed) console.info("\t- with lower and upper case mixed");

	while (true) {
		const password = prompt("new password>");

		if (!password) continue;
		if (await auth.validate(password)) break;
		else console.warn("[!] this password is not strong enough, please respect all the rules");
	}
}

if (auth.shouldCustomDoubleAuthMode) {
	if (auth.hasIgnoreMode) {
		auth.useIgnoreMode();
	} else if (auth.hasNotificationMode) {
		auth.useNotificationMode();
	} else if (auth.hasPinMode) {
		while (true) {
			const pin = prompt("new pin>");
			if (!pin) continue;

			auth.usePinMode(pin);
			break;
		}
	}
}
