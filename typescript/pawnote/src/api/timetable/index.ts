import { Child, Student, User } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { translateToWeekNumber } from "../../utils/date";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import {
	RequestDataIntervals,
	RequestDataResource,
	RequestDataWeekNumber,
	TimetableRequestData,
	TimetableRequestSignature,
} from "./request";
import { TimetableModel } from "./response";

export type TimetableResponse = ResponseFunctionWrapper<TimetableModel>;

export class Timetable extends RequestFunction<TimetableRequestData, TimetableRequestSignature> {
	private static readonly name = "PageEmploiDuTemps";

	private readonly user: User;
	private readonly decoder: any;

	constructor(
		user: User,
		private readonly resource: Student | Child,
	) {
		super(user.session, Timetable.name);
		this.user = user;
		this.decoder = new ResponseFunction(this.session, TimetableModel);
	}

	private async send(data: RequestDataIntervals | RequestDataWeekNumber): Promise<TimetableResponse> {
		const resource: RequestDataResource = {
			G: this.resource.kind,
			L: this.resource.name,
			N: this.resource.id,
		};

		const response = await this.execute(
			{
				estEDTAnnuel: false,
				estEDTPermanence: false,

				avecAbsencesEleve: false,
				avecRessourcesLibrePiedHoraire: false,

				avecAbsencesRessource: true,
				avecInfosPrefsGrille: true,
				avecConseilDeClasse: true,
				avecCoursSortiePeda: true,
				avecDisponibilites: true,
				avecRetenuesEleve: true,

				edt: { G: 16, L: "Emploi du temps" },

				ressource: resource,
				Ressource: resource,

				...data,
			},
			{
				onglet: 16,
				membre:
					this.resource instanceof Child
						? {
								G: this.resource.kind,
								N: this.resource.id,
							}
						: void 0,
			},
		);

		return this.decoder.decode(response);
	}

	public sendIntervals(start: Date, end?: Date): Promise<TimetableResponse> {
		const startV = TypeHttpDateTime.serializer(start);
		const endV = end ? TypeHttpDateTime.serializer(end) : void 0;

		return this.send({
			dateDebut: startV,
			DateDebut: startV,

			...(endV && {
				dateFin: endV,
				DateFin: endV,
			}),
		});
	}

	public sendWeekNumber(week?: number): Promise<TimetableResponse> {
		const n = week
			? week
			: translateToWeekNumber(this.user.parameters.general.openingDate, this.user.parameters.general.firstDate);

		return this.send({
			numeroSemaine: n,
			NumeroSemaine: n,
		});
	}
}
