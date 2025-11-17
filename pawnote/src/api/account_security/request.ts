import { TypeCommandeSecurisationCompteHttp } from "../models/TypeCommandeSecurisationCompteHttp";
import { TypeModeGestionDoubleAuthentification } from "../models/TypeModeGestionDoubleAuthentification";

export interface AccountSecurityDoubleAuthRequest {
    action: TypeCommandeSecurisationCompteHttp;
    libelle?: string;
    nouveauMDP?: string;
    codePin?: string;
    reinitPIN_OK?: boolean;
    codePINVertifReinit?: string;
    mode?: TypeModeGestionDoubleAuthentification;
    avecIdentification?: boolean;
    strIdentification?: string;
}