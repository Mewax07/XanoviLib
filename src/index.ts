import * as pawnote from "../pawnote/src";

const arg = process.argv.find((a) => a.startsWith("--p:"))

const Xanovi = {
	pronote: pawnote,
};

export default Xanovi;
