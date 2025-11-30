use crate::pronote::get_mobile_instance;
use anyhow::Result;
use serde::{Deserialize, Serialize};
use tauri::WebviewWindow;

#[derive(Serialize, Deserialize)]
pub struct LoginResult {
    pub username: String,
    pub token: String,
    pub kind: i32,
    #[serde(rename = "deviceUUID")]
    pub device_uuid: String,
}

#[tauri::command]
pub async fn login_with_cas(
    instance_url: String,
    device_uuid: String,
    webview: WebviewWindow,
) -> Result<LoginResult, String> {
    let instance = get_mobile_instance(&instance_url)
        .await
        .map_err(|e| e.to_string())?;

    let redirect = instance_url.clone();

    webview
        .eval(&format!("window.location.href = '{}';", redirect))
        .map_err(|e| e.to_string())?;

    Ok(LoginResult {
        username: "".into(),
        token: "".into(),
        kind: 0,
        device_uuid,
    })
}
