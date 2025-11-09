use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct FonctionParametresRequest {
    pub identifiant_nav: Option<String>,
    pub uuid: String,
}
