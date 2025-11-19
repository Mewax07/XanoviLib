import { translateToWeekNumber } from "../../core/date";
import { User } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { HomepageRequestData, HomepageRequestSignature } from "./request";
import { HomepageModel } from "./response";

export type HomepageResponse = ResponseFunctionWrapper<HomepageModel>;

export class HomepageAPI extends RequestFunction<HomepageRequestData, HomepageRequestSignature> {
	private static readonly name = "PageAccueil";

	private readonly user: User;
	private readonly decoder: any;

	constructor(user: User) {
		super(user.session, HomepageAPI.name);
		this.user = user;
		this.decoder = new ResponseFunction(user.session, HomepageModel);
	}

	public async send(week?: number): Promise<HomepageResponse> {
		const date = TypeHttpDateTime.serializer(this.user.parameters.nextBusinessDay);
		const weekNumber =
			week ?? translateToWeekNumber(this.user.parameters.nextBusinessDay, this.user.parameters.firstDate);

		const payload: HomepageRequestData = {
			EDT: { numeroSemaine: weekNumber },
			TAFARendre: { date },
			TAFEtActivites: { date },
			avecConseilDeClasse: false,
			coursNonAssures: { numeroSemaine: weekNumber },
			dateGrille: date,
			donneesProfs: { numeroSemaine: weekNumber },
			donneesVS: { numeroSemaine: weekNumber },
			exclusions: { numeroSemaine: weekNumber },
			incidents: { numeroSemaine: weekNumber },
			menuDeLaCantine: { date },
			modificationsEDT: { date },
			numeroSemaine: weekNumber,
			partenaireCDI: { CDI: {} },
			personnelsAbsents: { numeroSemaine: weekNumber },
			previsionnelAbsServiceAnnexe: { date },
			registreAppel: { date },
			tableauDeBord: { date },
		};

		const response = await this.execute(payload, { onglet: 7 });
		return this.decoder.decode(response);
	}
}
