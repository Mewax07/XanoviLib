use chrono::{DateTime, Utc};
use schwi::{send, HttpRequestBuilder};
use serde::{Deserialize, Serialize};
use std::time::SystemTime;
use url::Url;

use crate::model::{version::Version, webspace::Webspace};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstanceInformation {
    #[serde(rename = "nomEtab")]
    pub name: String,

    pub version: Version,

    #[serde(deserialize_with = "deserialize_date")]
    pub date: SystemTime,

    #[serde(rename = "espaces")]
    pub webspaces: Vec<InstanceInformationWebspace>,

    #[serde(rename = "CAS")]
    pub cas: Option<InstanceInformationCAS>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstanceInformationWebspace {
    #[serde(rename = "nom")]
    pub name: String,

    #[serde(rename = "URL")]
    pub path: String,

    #[serde(rename = "genreEspace")]
    pub kind: Webspace,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstanceInformationCAS {
    #[serde(rename = "actif")]
    pub active: bool,

    #[serde(rename = "casURL", deserialize_with = "empty_string_as_none")]
    pub url: Option<String>,

    #[serde(rename = "jetonCAS")]
    pub token: Option<String>,
}

fn deserialize_date<'de, D>(deserializer: D) -> Result<SystemTime, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let s: String = Deserialize::deserialize(deserializer)?;
    let dt = DateTime::parse_from_rfc3339(&s)
        .map_err(serde::de::Error::custom)?
        .with_timezone(&Utc);
    Ok(SystemTime::from(dt))
}

fn empty_string_as_none<'de, D>(deserializer: D) -> Result<Option<String>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let s: String = Deserialize::deserialize(deserializer)?;
    Ok(if s.is_empty() { None } else { Some(s) })
}

#[derive(Debug, Clone)]
pub struct Instance {
    pub base: String,
}

impl Instance {
    pub fn from_url(url: impl AsRef<str>) -> Self {
        let url = Url::parse(url.as_ref()).expect("Invalid URL");
        let clean = Self::clean(url);
        Self { base: clean }
    }

    fn clean(mut base: Url) -> String {
        let mut path = base.path().to_string();
        if path.ends_with(".html") {
            let mut parts: Vec<_> = path.split('/').collect();
            parts.pop();
            path = parts.join("/");
        }
        base.set_path(&path);

        let mut s = base.as_str().to_string();
        if s.ends_with('/') {
            s.pop();
        }
        s
    }

    pub async fn get_information(&self) -> Result<InstanceInformation, Box<dyn std::error::Error>> {
        let url = format!("{}/infoMobileApp.json", self.base);

        let req = HttpRequestBuilder::new(&url)
        .set_url_search_parameter("id", "0D264427-EEFC-4810-A9E9-346942A862A4")
        .set_header("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 PRONOTE Mobile APP Version/2.0.11")
        .build();

        let resp = send(req).await?;
        let json_text = resp.text();

        let parsed_value: serde_json::Value = match serde_json::from_str(&json_text) {
            Ok(v) => {
                println!("JSON syntax OK.");
                v
            }
            Err(e) => {
                eprintln!("JSON syntax invalid: {}", e);
                println!("{}", &json_text[..json_text.len().min(500)]);
                return Err(Box::new(e));
            }
        };

        let info: InstanceInformation =
            match serde_json::from_value::<InstanceInformation>(parsed_value) {
                Ok(i) => {
                    println!(
                        "Version: {}.{}.{}",
                        i.version.major, i.version.minor, i.version.patch
                    );
                    i
                }
                Err(e) => {
                    eprintln!("Deserialization failed: {}", e);
                    return Err(Box::new(e));
                }
            };

        Ok(info)
    }
}
