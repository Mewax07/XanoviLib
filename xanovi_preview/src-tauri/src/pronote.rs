use serde::{Deserialize, Serialize};
use tauri_plugin_http::reqwest::{self, Client};

#[derive(Debug, Serialize, Deserialize)]
pub struct CasInfo {
    pub url: String,
    pub token: String,
    pub auto: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AccountInfo {
    pub name: String,
    pub kind: i32,
    pub url: String,
    #[serde(default)]
    #[serde(rename = "useCas")]
    pub use_cas: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MobileInstance {
    pub cas: Option<CasInfo>,
    pub name: String,
    pub version: String,
    pub accounts: Vec<AccountInfo>,
}

pub async fn get_mobile_instance(instance_url: &str) -> anyhow::Result<MobileInstance> {
    let client = Client::new();
    let mut url = reqwest::Url::parse(instance_url)?;
    url.set_path("/infoMobileApp.json");
    url.query_pairs_mut()
        .append_pair("id", "0D264427-EEFC-4810-A9E9-346942A862A4");

    let res = client.get(url.clone()).send().await?;

    if !res.status().is_success() {
        anyhow::bail!("Failed to get mobile instance");
    }

    let json: serde_json::Value = res.json().await?;
    let cas = json.get("CAS");

    Ok(MobileInstance {
        cas: cas.and_then(|cas| {
            let actif = cas.get("actif")?.as_bool()?;
            if !actif {
                return None;
            }
            Some(CasInfo {
                url: cas.get("casURL")?.as_str()?.to_string(),
                token: cas.get("jetonCAS")?.as_str()?.to_string(),
                auto: json
                    .get("espaces")?
                    .as_array()?
                    .iter()
                    .all(|e| e.get("protocole").unwrap().as_str().unwrap() == "daCAS"),
            })
        }),
        name: json.get("nomEtab").unwrap().as_str().unwrap().to_string(),
        version: json
            .get("version")
            .unwrap()
            .as_array()
            .unwrap()
            .iter()
            .map(|v| v.as_i64().unwrap().to_string())
            .collect::<Vec<String>>()
            .join("."),
        accounts: json
            .get("espaces")
            .unwrap()
            .as_array()
            .unwrap()
            .iter()
            .map(|e| AccountInfo {
                name: e.get("nom").unwrap().as_str().unwrap().to_string(),
                kind: e.get("genreEspace").unwrap().as_i64().unwrap() as i32,
                url: e.get("URL").unwrap().as_str().unwrap().to_string(),
                use_cas: e.get("protocole").unwrap().as_str().unwrap() == "daCAS",
            })
            .collect(),
    })
}
