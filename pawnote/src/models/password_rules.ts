import { ReglesSaisieMDP } from "../api/authentification/response";
import { TypeOptionGenerationMotDePasse } from "../api/models/TypeOptionGenerationMotDePasse";

export class PasswordRules {
	public readonly min: number;
	public readonly max: number;
	public readonly withAtLeastOneLetter: boolean;
	public readonly withAtLeastOneNumericCharacter: boolean;
	public readonly withAtLeastOneSpecialCharacter: boolean;
	public readonly withLowerAndUpperCaseMixed: boolean;

	public constructor(_raw: ReglesSaisieMDP) {
		this.min = _raw.min;
		this.max = _raw.max;

		this.withAtLeastOneLetter = _raw.options.includes(TypeOptionGenerationMotDePasse.OGMDP_AvecAuMoinsUnChiffre);

		this.withAtLeastOneNumericCharacter = _raw.options.includes(
			TypeOptionGenerationMotDePasse.OGMDP_AvecAuMoinsUnChiffre,
		);

		this.withAtLeastOneSpecialCharacter = _raw.options.includes(
			TypeOptionGenerationMotDePasse.OGMDP_AvecAuMoinsUnCaractereSpecial,
		);

		this.withLowerAndUpperCaseMixed = _raw.options.includes(
			TypeOptionGenerationMotDePasse.OGMDP_AvecMelangeMinusculeMajuscule,
		);
	}
}
