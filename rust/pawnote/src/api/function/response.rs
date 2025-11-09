use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct FunctionParametersModel {
    #[serde(rename = "identifiantNav")]
    pub navigator_identifier: Option<String>,
    #[serde(rename = "URLEspace")]
    pub webspace_url: String,
    #[serde(rename = "Nom")]
    pub webspace_name: String,
}

#[derive(Serialize, Deserialize)]
pub struct FunctionParametersSignature {
    pub exclusive: bool,
}