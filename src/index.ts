import { loadConfig } from "~t0/index";
import * as pawnote from "../pawnote/src";
import * as meowdle from "../meowdle/src";

const arg = process.argv.find((a) => a.startsWith("--p:"))
const profile = arg ? arg.replace("--p:", "") : "dev1";
loadConfig(profile);

console.log(`Loaded profile: ${profile}`);

const Xanovi = {
	pronote: pawnote,
	moodle: meowdle,
};

export default Xanovi;
