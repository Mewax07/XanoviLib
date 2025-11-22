import Xanovi from "../../src";
const { pronote: pawnote } = Xanovi;

const instance = pawnote.Instance.fromURL("https://demo.index-education.net/pronote/eleve.html");
console.log(instance.base);

const info = await instance.getInformation();
console.log(info);
