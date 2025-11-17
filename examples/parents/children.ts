import Xanovi from "../../src";
const { pronote: pawnote } = Xanovi;

const instance = pawnote.Instance.fromURL("https://demo.index-education.net/pronote/parent.html");
const portal = new pawnote.ParentLoginPortal(instance);
const auth = await portal.credentials("demonstration", "pronotevs");

console.info(`[*] authenticating to ${instance.base}...`);

const parent = await portal.finish(auth);

console.info("[*] congratulations, you're re-authenticated!");
console.info("[*] new token:", parent.token);

for (const child of parent.children) {
	console.log("[+]", child.name, `(${child.id})`);
}
