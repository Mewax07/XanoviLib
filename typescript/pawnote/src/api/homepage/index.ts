import { Session } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { translateToWeekNumber } from "../../utils/date";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { HomepageRequestData, HomepageRequestSignature } from "./request";
import { HomepageModel } from "./response";

export type HomepageResponse = ResponseFunctionWrapper<HomepageModel>;

export class Homepage extends RequestFunction<HomepageRequestData, HomepageRequestSignature> {
	private static readonly name = "PageAccueil";

	private readonly decoder = new ResponseFunction(this.session, HomepageModel);

	public constructor(session: Session) {
		super(session, Homepage.name);
	}

	public async send(week?: number): Promise<HomepageResponse> {
		const date = TypeHttpDateTime.serializer(this.session.parameters.general.openingDate);
		const weekNumber = week
			? week
			: translateToWeekNumber(
					this.session.parameters.general.openingDate,
					this.session.parameters.general.firstDate,
				);
		const response = await this.execute(
			{
				EDT: {
					numeroSemaine: weekNumber,
				},
				TAFARendre: {
					date,
				},
				TAFEtActivites: {
					date,
				},
				avecConseilDeClasse: false,
				coursNonAssures: {
					numeroSemaine: weekNumber,
				},
				dateGrille: date,
				donneesProfs: {
					numeroSemaine: weekNumber,
				},
				donneesVS: {
					numeroSemaine: weekNumber,
				},
				exclusions: {
					numeroSemaine: weekNumber,
				},
				incidents: {
					numeroSemaine: weekNumber,
				},
				menuDeLaCantine: {
					date,
				},
				modificationsEDT: {
					date,
				},
				numeroSemaine: weekNumber,
				partenaireCDI: {
					CDI: {},
				},
				personnelsAbsents: {
					numeroSemaine: weekNumber,
				},
				previsionnelAbsServiceAnnexe: {
					date,
				},
				registreAppel: {
					date,
				},
				tableauDeBord: {
					date,
				},
			},
			{
				onglet: 7,
			},
		);

		return await this.decoder.decode(response);
	}
}
