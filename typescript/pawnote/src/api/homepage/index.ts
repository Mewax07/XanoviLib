import { User } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { translateToWeekNumber } from "../../utils/date";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { HomepageRequestData, HomepageRequestSignature } from "./request";
import { HomepageModel } from "./response";

export type HomepageResponse = ResponseFunctionWrapper<HomepageModel>;

export class Homepage extends RequestFunction<HomepageRequestData, HomepageRequestSignature> {
	private static readonly name = "PageAccueil";

	private readonly user: User;
	private readonly decoder: any;

	constructor(user: User) {
		super(user.session, Homepage.name);
		this.user = user;
		this.decoder = new ResponseFunction(user.session, HomepageModel);
	}

	public async send(week?: number): Promise<HomepageResponse> {
		const general = this.user.parameters.general;
		const date = TypeHttpDateTime.serializer(general.openingDate);
		const weekNumber = week ?? translateToWeekNumber(general.openingDate, general.firstDate);

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
