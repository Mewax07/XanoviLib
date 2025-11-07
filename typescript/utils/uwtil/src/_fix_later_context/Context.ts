import { FonctionParametresResponse } from "~p0/api/function";
import { CycleObject } from "./Cycle";

class Context {
	private static instance: Context;
	public globalCycle: CycleObject;

	private constructor() {
		this.globalCycle = new CycleObject();
	}

	public static getInstance(): Context {
		if (!Context.instance) {
			Context.instance = new Context();
		}
		return Context.instance;
	}

	initCycle(data: FonctionParametresResponse) {
		this.globalCycle.init({
			firstDate: data.data.general.firstDate,
			lastDate: data.data.general.lastDate,
			daysWorkedByCycle: data.data.general.workingDaysPerCycle,
			openDays: data.data.general.halfBoardDays,
		});
	}
}

export const GlobalContext = Context.getInstance();