declare namespace exports_src {
	export { m };
}
declare function m(): void;
declare namespace exports_src2 {
	export { Webspace, Version, User, UnreachableError, TimetableEntryLesson, TimetableEntryDetention, TimetableEntryActivity, TimetableEntry, Timetable, SuspendedIpError, Subject, StudentLoginPortal, StudentAdministration2 as StudentAdministration, Student, SourceTooLongError, SessionRSA, SessionExpiredError, SessionAPI, SessionAES, Session, ServerSideError, ResponseFunctionWrapper, ResponseFunction, RequestFunction, RateLimitedError, PendingLogin, ParentLoginPortal, Parent, PageUnavailableError, LoginPortal, LessonCategory, InstanceInformationWebspace, InstanceInformationCAS, InstanceInformation, Instance, Homework2 as Homework, HomepageSessionAccess, HomepageSession, Homepage, Child, BusyPageError, BadCredentialsError, AuthenticateError, AccountDisabledError, AccessDeniedError };
}
declare class AccessDeniedError extends Error {
	constructor();
}
declare class AccountDisabledError extends Error {
	constructor();
}
declare class AuthenticateError extends Error {
	constructor(message: string);
}
declare class BadCredentialsError extends Error {
	constructor();
}
declare class BusyPageError extends Error {
	constructor();
}
declare class PageUnavailableError extends Error {
	constructor();
}
declare class RateLimitedError extends Error {
	constructor();
}
declare class ServerSideError extends Error {
	constructor(message?: string);
}
declare class SourceTooLongError extends Error {
	constructor(limit: number);
}
declare class SessionExpiredError extends Error {
	constructor();
}
declare class SuspendedIpError extends Error {
	constructor();
}
declare class UnreachableError extends Error {
	constructor(fn: string);
}
type Version = Array<number>;
declare namespace Version {
	/** @returns true if the version is >= 2024.3.9 */
	function isGreaterThanOrEqualTo202439([major, minor, patch]: Version): boolean;
	/** @returns true if the version is >= 2025.1.3 */
	function isGreaterThanOrEqualTo202513([major, minor, patch]: Version): boolean;
}
declare enum Webspace {
	SeniorManagement = 17,
	Teachers = 8,
	StudentAdministration = 14,
	Parents = 7,
	TeachingAssistants = 26,
	Students = 6,
	Company = 39
}
declare namespace Webspace {
	function fromPath(path: string): Webspace;
	function toMobilePath(webspace: Webspace): string;
}
declare class InstanceInformation {
	name: string;
	version: Version;
	date: Date;
	webspaces: InstanceInformationWebspace[];
	cas: InstanceInformationCAS | null;
}
declare class InstanceInformationWebspace {
	name: string;
	path: string;
	kind: Webspace | typeof Webspace.fromPath | typeof Webspace.toMobilePath;
}
declare class InstanceInformationCAS {
	active: boolean;
	url: string | null;
	token: string | null;
}
declare class Instance {
	readonly base: string;
	private constructor();
	private clean;
	static fromURL(url: string | URL): Instance;
	getInformation(): Promise<InstanceInformation>;
}
declare class PasswordRules {
	readonly min: number;
	readonly max: number;
	readonly withAtLeastOneLetter: boolean;
	readonly withAtLeastOneNumericCharacter: boolean;
	readonly withAtLeastOneSpecialCharacter: boolean;
	readonly withLowerAndUpperCaseMixed: boolean;
}
declare class PendingLogin {
	get shouldCustomPassword(): boolean;
	get shouldCustomDoubleAuthMode(): boolean;
	get shouldEnterPin(): boolean;
	get shouldRegisterSource(): boolean;
	get hasPinMode(): boolean;
	usePinMode(pin: string): void;
	get hasIgnoreMode(): boolean;
	useIgnoreMode(): void;
	get hasNotificationMode(): boolean;
	useNotificationMode(): void;
	get password(): PasswordRules;
	validate(password: string): Promise<boolean>;
	verify(pin: string): Promise<boolean>;
	source(source: string): Promise<boolean>;
}
declare abstract class LoginPortal {
	protected readonly _instance: Instance;
}
declare enum TypeHttpVariable {
	TypeHttpCategorie = 0,
	TypeHttpCardinal = 1,
	TypeHttpBoolean = 2,
	TypeHttpString = 3,
	TypeHttpColor = 4,
	TypeHttpAlignment_Inutilise = 5,
	TypeHttpFontStyles_Inutilise = 6,
	/** @see {@link TypeHttpDateTime | implementation} */
	TypeHttpDateTime = 7,
	/** @see {@link TypeHttpDomaine | implementation} */
	TypeHttpDomaine = 8,
	TypeHttpTraduction = 9,
	/** @see {@link TypeHttpNote | implementation} */
	TypeHttpNote = 10,
	/** @see {@link TypeHttpEnsembleCardinal | implementation} */
	TypeHttpEnsembleCardinal = 11,
	_TypeHttpLongNote_Inutilise = 12,
	TypeHttpDouble = 13,
	TypeHttpArrondi = 14,
	/** @see {@link TypeHttpEnsemble | implementation} */
	TypeHttpEnsemble = 15,
	TypeHttpIP = 16,
	TypeHttpUrl = 17,
	TypeHttpSetOf_MrFiche = 18,
	_TypeHttpDoubleNote_Inutilise = 19,
	TypeHttpInteger = 20,
	TypeHttpHtml = 21,
	_TypeHttpJSON_Inutilise = 22,
	/** @see {@link TypeHttpChaineBrute | implementation} */
	TypeHttpChaineBrute = 23,
	/** @see {@link TypeHttpElement | implementation} */
	TypeHttpElement = 24,
	TypeHttpFichierBase64 = 25,
	/** @see {@link TypeHttpEnsembleNombre | implementation} */
	TypeHttpEnsembleNombre = 26,
	/** @see {@link TypeHttpHtmlSafe | implementation} */
	TypeHttpHtmlSafe = 27
}
interface Note {
	_T: TypeHttpVariable.TypeHttpNote2;
	V: string;
}
declare class TypeHttpNote2 {
	value: string;
	constructor(value: string);
	static deserializer: (value: Note) => TypeHttpNote2;
}
declare enum AttachmentDifficulty {
	None = 0,
	Easy = 1,
	Medium = 2,
	Hard = 3
}
declare enum AttachmentReturnKind {
	None = 0,
	Paper = 1,
	FileUpload = 2,
	Kiosk = 3,
	AudioRecording = 4
}
declare enum TypeOrigineCreationCategorieCahierDeTexte {
	OCCCDT_Utilisateur = 0,
	OCCCDT_Pre_Cours = 1,
	OCCCDT_Pre_Correction = 2,
	OCCCDT_Pre_Devoir = 3,
	OCCCDT_Pre_Interro = 4,
	OCCCDT_Pre_TD = 5,
	OCCCDT_Pre_TP = 6,
	OCCCDT_Pre_Evaluation = 7,
	OCCCDT_Pre_EPI = 8,
	OCCCDT_Pre_AP = 9,
	OCCCDT_Pre_Mod_Peda_Oral = 10,
	OCCCDT_Pre_Mod_Peda_Ecrit = 11,
	OCCCDT_Pre_LienVisio = 12,
	OCCCDT_Pre_CCF = 13,
	OCCCDT_Pre_EC = 14
}
declare class Id {
	id: string;
}
declare class Label extends Id {
	label: string;
}
declare class Content {
	id: string | null;
	label: string;
	kind: number;
	isTimetable: boolean | null;
	isServiceGroup: boolean | null;
}
declare class CategoryOrigin {
	id: string | null;
	kind: TypeOrigineCreationCategorieCahierDeTexte;
	label: string;
	labelIcon: string;
}
declare class HomeworkPointer extends Id {
	isTest: boolean | null;
	categories: CategoryOrigin[];
}
declare class Course {
	id: string;
	kind: number;
	position: number | null;
	start: number;
	duringTime: number;
	backgroundColor: string;
	courseDate: Date;
	courseDateEnd: Date | null;
	content: Content[];
	notebook: HomeworkPointer | null;
	withHomeworkPublished: boolean;
	withNotebook: boolean | null;
	status: string | null;
	isFieldTrip: boolean | null;
	isDetention: boolean | null;
	notes: string | null;
	isCancelled: boolean | null;
	studentExcused: boolean | null;
	supervisors: string[] | null;
	resourceTypeLabel: string | null;
	resourceLabel: string | null;
	reason: string | null;
}
declare class Actuality {
	label: string;
	id: string;
	author: string;
	creationDate: Date;
	startDate: Date;
	endDate: Date;
	isInformation: boolean | null;
	isSurvey: boolean | null;
	readed: boolean | null;
}
declare class Actualities {
	actualitiesList: Actuality[];
}
declare class Agenda {
	label: string;
	id: string;
	kind: number;
	startDate: Date;
	endDate: Date;
	comment: string;
	celluleColor: string;
	noSchedule: boolean | null;
}
declare class AgendaList {
	eventsList: Agenda[];
}
declare class Recess {
	name: string;
	slot: number;
}
declare class LunchIcon {
	text: string;
	check: boolean | null;
	delete: boolean | null;
}
declare class LunchPeriod {
	icon: LunchIcon;
	hint: string;
}
declare class Lunch {
	lunch: LunchPeriod | null;
}
declare class DayCycle {
	dayCycle: number;
	weekNumber: number;
	lunch: Lunch;
}
declare class Absences {
	dayCycles: DayCycle[];
}
declare class HomeworkContentSubject {
	labal: string;
	id: string;
}
declare class Service {
	label: string;
	id: string;
	kind: number;
	color: string;
}
declare class Periode {
	label: string;
	id: string;
}
declare class Note2 {
	id: string;
	kind: number;
	scale: TypeHttpNote2;
	defaultScale: TypeHttpNote2;
	date: Date;
	note: TypeHttpNote2;
	period: Periode[];
	service: Service[];
}
declare class Notes {
	withDetailAssignment: boolean;
	withDetailService: boolean | null;
	listAssignments: Note2[];
}
declare class HomeworkBase {
	id: string;
	duringTime: number;
	backgroundColor: string;
	canComplete: boolean | null;
	withReturn: boolean | null;
	done: boolean;
	returnType: AttachmentReturnKind | null;
	difficultyLevel: AttachmentDifficulty | null;
}
declare class HomeworkContent extends HomeworkBase {
	kind: number;
	givenOn: Date;
	dueOn: Date;
	order: number;
	subject: HomeworkContentSubject[];
}
declare class Homework {
	dayCycles: HomeworkContent[];
}
declare class HomepageModel {
	courseList: Course[];
	absences: Absences;
	actualities: Actualities | null;
	agenda: AgendaList;
	withCanceledCourse: boolean;
	firstSlotOfTheDay: number;
	startLunchWeek: number;
	endLunchWeek: number;
	notes: Notes;
	recesses: Recess[];
	homework: Homework;
}
declare class Periode2 {
	label: string;
	id: string;
	kind: number;
	gradingPeriod: number;
	startDate: Date;
	endDate: Date;
}
declare class JoursFeries {
	label: string;
	id: string;
	startDate: Date;
	endDate: Date;
}
declare class Parameters {
	private readonly parameters;
	get navigatorIdentifier(): string | null;
	get slotsPerDay(): number;
	get nextBusinessDay(): Date;
	get firstMonday(): Date;
	get firstDate(): Date;
	get lastDate(): Date;
	get endings(): Array<string>;
	get periods(): Array<Period>;
	get holidays(): Array<Holiday>;
	get weekFrequencies(): Map<number, WeekFrequency>;
	dateToWeekNumber(date: Date): number;
}
declare class WeekFrequency {
	readonly frequency: number;
	label: string;
}
declare class Holiday {
	id: string;
	name: string;
	startDate: Date;
	endDate: Date;
	constructor(ferie: JoursFeries);
}
declare class Period {
	private readonly periode;
	constructor(periode: Periode2);
	get id(): string;
	get kind(): number;
	get name(): string;
	get startDate(): Date;
	get endDate(): Date;
}
import { HttpResponse } from "schwi";
import { PublicKey } from "micro-rsa-dsa-dh/rsa";
type Task<T> = () => Promise<T>;
declare class AsyncQueue {
	private _nodes;
	private _pending;
	run<T>(task: Task<T>): Promise<T>;
	private _dequeue;
	private _next;
}
declare class Session {
	readonly instance: InstanceInformation;
	readonly homepage: HomepageSession;
	readonly url: string;
	readonly rsa: SessionRSA;
	readonly aes: SessionAES;
	readonly api: SessionAPI;
	presence: any;
	constructor(instance: InstanceInformation, homepage: HomepageSession, url: string);
}
declare class SessionRSA {
	private static DEFAULT_RSA_MODULUS;
	private static DEFAULT_RSA_EXPONENT;
	private modulus;
	private exponent;
	/**
	* Whether the modulus and exponent are coming from
	* the webspace HTML homepage or not.
	*/
	readonly custom: boolean;
	get publicKey(): PublicKey;
}
declare class SessionAES {
	iv: Uint8Array<ArrayBufferLike>;
	key: Uint8Array<ArrayBufferLike>;
	private get _mKey();
	private get _mIv();
	encrypt(input: Uint8Array | string | number): Uint8Array;
	decrypt(bytes: Uint8Array): Uint8Array;
}
interface Properties {
	data: string;
	requestId: string;
	signature: string;
	orderNumber: string;
	secureData: string;
	session: string;
	fileUploadOrderNumber: string;
	fileUploadSession: string;
	fileUploadRequestId: string;
	fileUploadFileId: string;
	fileUploadMd5: string;
}
declare class SessionAPI {
	order: number;
	queue: AsyncQueue;
	skipEncryption: boolean;
	skipCompression: boolean;
	properties: Properties;
}
declare enum HomepageSessionAccess {
	Account = 0,
	AccountConnection = 1,
	DirectConnection = 2,
	TokenAccountConnection = 3,
	TokenDirectConnection = 4,
	CookieConnection = 5
}
declare class HomepageSession {
	id: number;
	webspace: Webspace | typeof Webspace.fromPath | typeof Webspace.toMobilePath;
	demo: boolean | null;
	access: HomepageSessionAccess;
	/** @deprecated since 2023 */
	rsaModulus: string | null;
	/** @deprecated since 2023 */
	rsaExponent: string | null;
	enforceEncryption: boolean;
	enforceCompression: boolean;
	skipEncryption: boolean;
	skipCompression: boolean;
	/**
	* Whether instance have an SSL certificate installed or not.
	*/
	http: boolean;
	/**
	* Whether polling should be used instead of presence.
	* @deprecated since 2025.1.3
	*/
	poll: boolean;
}
declare abstract class RequestFunction<
	Data,
	Signature = undefined
> {
	protected readonly session: Session;
	private name;
	protected constructor(session: Session, name: string);
	private propertiesToPayload;
	protected execute(data?: Data, signature?: Signature): Promise<HttpResponse>;
}
import { HttpResponse as HttpResponse2 } from "schwi";
interface ResponseFunctionWrapper<
	DataModel,
	SignatureModel = undefined
> {
	data: DataModel;
	signature?: SignatureModel;
}
declare class ResponseFunction<
	DataModel extends new (...args: any[]) => any,
	SignatureModel extends (new (...args: any[]) => any) | undefined = undefined
> {
	private readonly session;
	private readonly DataModel;
	private readonly SignatureModel?;
	constructor(session: Session, DataModel: DataModel, SignatureModel?: SignatureModel | undefined);
	decode(response: HttpResponse2): Promise<ResponseFunctionWrapper<InstanceType<DataModel>, SignatureModel extends new (...args: any[]) => any ? InstanceType<SignatureModel> : undefined>>;
}
type HomepageResponse = ResponseFunctionWrapper<HomepageModel>;
declare class Homepage {
	private parameters;
	private _raw;
	constructor(parameters: Parameters, _raw: HomepageResponse);
	get courses(): Course[];
	get actualities(): Actualities | null;
	get agenda(): AgendaList;
	get notes(): Notes;
}
declare class Content2 extends Label {
	unk_ListePieceJointe: Id[] | null;
	unk_ListeThemes: Id[] | null;
	category: CategoryOrigin[] | null;
	themeLabel: string | null;
}
declare class _Homework extends Id {
	backgroundColor: string;
	date: Date;
	endDate: Date;
	subject: HomeworkContentSubject[];
	course: Id[] | null;
	dueDate: Date;
	contentList: Content2[] | null;
	teacherList: Label[];
	locked: boolean | null;
}
declare class HomeworkModel {
	homeworkList: _Homework[];
}
type HomeworkResponse = ResponseFunctionWrapper<HomeworkModel>;
declare class HomeworkBase2 {
	id: string;
	duringTime: number;
	backgroundColor: string;
	canComplete: boolean | null;
	withReturn: boolean | null;
	done: boolean;
	returnType: AttachmentReturnKind | null;
	difficultyLevel: AttachmentDifficulty | null;
}
declare class _Homework2 extends HomeworkBase2 {
	publicName: string | null;
	themeLabel: string | null;
	withFormat: boolean;
	givenOn: Date;
	dueOn: Date;
	subject: HomeworkContentSubject[];
	course: Id[] | null;
}
declare class HomeworkModel2 {
	homeworkList: _Homework2[];
}
type HomeworkResponse2 = ResponseFunctionWrapper<HomeworkModel2>;
type HomeworkResponse3 = {
	toDoList: HomeworkResponse2;
	content: HomeworkResponse;
};
declare class Homework2 {
	private parameters;
	private _raw;
	constructor(parameters: Parameters, _raw: HomeworkResponse3);
}
declare class GridPreferences {
	resourceType: number;
}
declare class TimetableModel {
	selectedDayCycle: number;
	withCanceledCourse: boolean;
	gridPrefs: GridPreferences;
	courses: Course[];
	firstSlotOfTheDay: number;
	startLunchWeek: number;
	endLunchWeek: number;
	absences: Absences;
	recesses: Recess[];
}
type TimetableResponse = ResponseFunctionWrapper<TimetableModel>;
declare class TimetableEntry {
	protected readonly parameters: Parameters;
	protected readonly course: Course;
	get id(): string;
	get backgroundColor(): string | null;
	get startDate(): Date;
	get endDate(): Date;
	get blockLength(): number;
	get blockPosition(): number;
	get notes(): string | null;
	get status(): string | null;
	get weekNumber(): number;
}
declare class LessonCategory {
	private categories;
	get origin(): TypeOrigineCreationCategorieCahierDeTexte;
	get name(): string;
	get labelIcon(): string;
	get test(): boolean;
}
declare class Subject {
	readonly id: string;
	readonly name: string;
	readonly inGroups: boolean;
}
declare class TimetableEntryActivity extends TimetableEntry {
	get title(): string;
	get attendants(): Array<string>;
	get resourceTypeName(): string;
	get resourceValue(): string;
}
declare class TimetableEntryDetention extends TimetableEntry {
	get title(): string | null;
	get teachers(): Array<string>;
	get staff(): Array<string>;
	get rooms(): Array<string>;
}
declare class TimetableEntryLesson extends TimetableEntry {
	get kind(): number;
	get categories(): Array<LessonCategory>;
	get status(): string | null;
	get canceled(): boolean;
	get resourceId(): string | null;
	get test(): boolean;
	get exempted(): boolean;
	get subject(): Subject | null;
	get teachers(): Array<string>;
	get staff(): Array<string>;
	get rooms(): Array<string>;
	get groups(): Array<string>;
}
declare class Timetable {
	private parameters;
	private timetable;
	readonly entries: Array<TimetableEntry>;
	constructor(parameters: Parameters, timetable: TimetableResponse);
	private get withCanceledClasses();
	filter(withSuperposedCanceledClasses?: boolean, withCanceledClasses?: boolean, withPlannedClasses?: boolean): Array<TimetableEntry>;
	private getClassEndBlockPosition;
	private getSuperimposedClassesIndexes;
	private makeSuperimposedCanceledClassesInvisible;
}
declare class StudentAdministration2 {
	private readonly _user;
	private readonly _sub?;
	private get _resource();
	getHomepage(week?: number): Promise<Homepage>;
	getTimetableFromIntervals(start: Date, end?: Date): Promise<Timetable>;
	getTimetableFromWeek(week?: number): Promise<Timetable>;
	getHomeworkFromIntervals(start?: number, end?: number): Promise<Homework2>;
	getHomeworkSinceDate(date?: Date): Promise<Homework2>;
	startPresenceInterval: (interval?: number) => void;
	clearPresenceInterval: () => void;
}
declare abstract class User {
	get username(): string;
	get token(): string;
	get uuid(): string;
	get id(): string;
	get name(): string;
	get kind(): number;
}
declare class Child {
	readonly parent: Parent;
	private readonly _raw;
	readonly administration: StudentAdministration2;
	get id(): string;
	get name(): string;
	get kind(): number;
}
declare class Parent extends User {
	readonly children: Array<Child>;
}
declare class ParentLoginPortal extends LoginPortal {
	constructor(instance: Instance);
	credentials(username: string, password: string, deviceUUID?: string, navigatorIdentifier?: string | null): Promise<PendingLogin>;
	token(username: string, token: string, deviceUUID: string, navigatorIdentifier?: string | null): Promise<PendingLogin>;
	finish(login: PendingLogin): Promise<Parent>;
}
declare class Student extends User {
	readonly administration: StudentAdministration2;
}
declare class StudentLoginPortal extends LoginPortal {
	constructor(instance: Instance);
	credentials(username: string, password: string, deviceUUID?: string, navigatorIdentifier?: string | null): Promise<PendingLogin>;
	token(username: string, token: string, deviceUUID: string, navigatorIdentifier?: string | null): Promise<PendingLogin>;
	finish(login: PendingLogin): Promise<Student>;
}
declare const Xanovi: {
	pronote: typeof exports_src2;
	moodle: typeof exports_src;
};
export { Xanovi as default };
