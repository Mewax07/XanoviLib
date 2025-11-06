import { rename, t } from "~d0/index";

export class Cours {
    @rename("place")
    public start = t.number();

    @rename("duree")
    public duringTime = t.number();
}

export class HomepageModel {
    @rename("ListeCours")
    public homeworkList = t.array(t.reference(Cours));
}

export class HomepageModelSignature {
    @rename("public")
    public tab = t.number();
}