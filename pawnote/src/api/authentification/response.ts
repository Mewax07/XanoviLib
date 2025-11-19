import { deserializeWith, rename, t } from "~d0/index";
import { TypeHttpDateTime } from "../http/TypeHttpDateTime";
import { TypeHttpEnsembleNombre } from "../http/TypeHttpEnsembleNombre";
import { TypeActionIHMSecurisationCompte } from "../models/TypeActionIHMSecurisationCompte";
import { TypeModeGestionDoubleAuthentification } from "../models/TypeModeGestionDoubleAuthentification";
import { TypeOptionGenerationMotDePasse } from "../models/TypeOptionGenerationMotDePasse";

export class AuthentificationModel {
	@rename("Acces")
	public access = t.option(t.number());

	@rename("libelleUtil")
	public labelUtil = t.string();

	@rename("modeSecurisationParDefaut")
	public defaultSecurityMode = t.enum(TypeModeGestionDoubleAuthentification);

	@rename("cle")
	public key = t.string();

	@rename("derniereConnexion")
	@deserializeWith(TypeHttpDateTime.deserializer)
	public lastLogin = t.instance(Date);

	@rename("jetonConnexionAppliMobile")
	public token = t.string();

	@rename("codePINFixe")
	public isPinCodeFixed = t.boolean();

	@rename("reglesSaisieMDP")
	public passwordRules = t.reference(ReglesSaisieMDP);

	@rename("actionsDoubleAuth")
	@deserializeWith(TypeHttpEnsembleNombre.deserializer)
	public securityActions = t.option(t.array(t.enum(TypeActionIHMSecurisationCompte)));

	@rename("modesPossibles")
	@deserializeWith(TypeHttpEnsembleNombre.deserializer)
	public availableSecurityModes = t.option(t.array(t.enum(TypeModeGestionDoubleAuthentification)));

	public changementStrategieImpose = t.option(t.boolean());

	@rename("messageForcerModificationMdp")
	public forcePasswordResetMessage = t.option(t.string());
}

export class ReglesSaisieMDP {
	public min = t.number();
	public max = t.number();

	@rename("regles")
	@deserializeWith(TypeHttpEnsembleNombre.deserializer)
	public options = t.array(t.enum(TypeOptionGenerationMotDePasse));
}
