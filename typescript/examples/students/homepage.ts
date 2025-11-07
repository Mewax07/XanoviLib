import Xanovi from "../../src";
const { pronote: pawnote } = Xanovi;

const instance = pawnote.Instance.fromURL("https://demo.index-education.net/pronote/parent.html");
const portal = new pawnote.StudentLoginPortal(instance);
const auth = await portal.credentials("demonstration", "pronotevs");

console.info(`[*] authenticating to ${instance.base}...`);

const student = await portal.finish(auth);

console.info("[*] congratulations, you're authenticated!");
console.info("[*] token:", student.token);

const homepage = await student.administration.getHomepage();
console.log(homepage);