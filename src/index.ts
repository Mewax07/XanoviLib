import * as meowdle from "../meowdle/src";
import * as pawnote from "../pawnote/src";

// const arg = process.argv.find((a) => a.startsWith("--p:"))
// const profile = arg ? arg.replace("--p:", "") : "dev1";
// loadConfig(profile);

// console.log(`Loaded profile: ${profile}`);

const Xanovi = {
	pronote: pawnote,
	moodle: meowdle,
};

export default Xanovi;
