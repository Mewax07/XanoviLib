use schwi::{send, HttpRequestBuilder, HttpRequestRedirection};
use serde_json::Value;
use std::{
    cell::RefCell,
    collections::HashMap,
    error::Error,
    sync::{Arc, RwLock},
};

use crate::{
    BusyPageError, FunctionParameters, HomepageSession, Instance, PageUnavailableError, Parameters,
    PendingLogin, Session, SuspendedIpError, UnreachableError, Webspace, UA,
};

#[async_trait::async_trait(?Send)]
pub trait LoginPortal {
    fn instance(&self) -> &Instance;

    async fn _credentials(
        &self,
        webspace: Webspace,
        username: &str,
        password: &str,
        device_uuid: &str,
        navigator_identifier: Option<&str>,
    ) -> Result<PendingLogin, Box<dyn std::error::Error>> {
        let instance_info = self.instance().get_information().await?;
        let homepage = self
            .get_webspace_homepage_session(webspace, HashMap::new())
            .await?;

        let session = Session::new(instance_info, homepage, self.instance().base.clone());

        let session_ref = RefCell::new(session);
        let navigator_identifier = navigator_identifier.map(|s| s.to_string());

        let mut func_params = FunctionParameters::new(&session_ref);

        let fp_result = func_params.send(navigator_identifier).await?;

        let parameters = Parameters::new(Ok(fp_result))?;

        println!("{:?}", parameters.navigator_identifier());

        Ok(PendingLogin::new(session_ref.into_inner()))
    }

    // async fn _finish(
    //     &self,
    //     mut login: PendingLogin
    // ) -> Result<UserParameters, Box<dyn Error>> {
    //     //
    // }

    async fn get_webspace_homepage_session(
        &self,
        webspace: Webspace,
        cookies: HashMap<String, String>,
    ) -> Result<HomepageSession, Box<dyn Error>> {
        let mut url = format!("{}/{}", self.instance().base, webspace.to_mobile_path());
        let params = vec![
            ("fd", "1"),
            ("login", "true"),
            ("bydlg", "A6ABB224-12DD-4E31-AD3E-8A39A1C2C335"),
        ];
        let qs: String = params
            .iter()
            .map(|(k, v)| format!("{}={}", k, v))
            .collect::<Vec<_>>()
            .join("&");
        url.push('?');
        url.push_str(&qs);

        let mut req_builder = HttpRequestBuilder::new(&url)
            .set_redirection(HttpRequestRedirection::Manual)
            .set_header("User-Agent", UA);

        for (key, value) in &cookies {
            req_builder = req_builder.set_cookie(key, value);
        }

        let req = req_builder.build();

        let resp = send(req).await?;
        let mut html = resp.text();

        if html.contains("Votre adresse IP est provisoirement suspendue") {
            return Err(Box::new(SuspendedIpError));
        } else if html.contains("Le site n'est pas disponible") {
            return Err(Box::new(PageUnavailableError));
        } else if html.contains("Le site est momentanément indisponible") {
            return Err(Box::new(BusyPageError));
        }

        html = html.replace(' ', "").replace('\n', "");

        let from = "Start(";
        let to = ")}catch";
        let start_idx = html.find(from).ok_or(UnreachableError("Start not found"))? + from.len();
        let end_idx = html.find(to).ok_or(UnreachableError("End not found"))?;
        let arg = &html[start_idx..end_idx];

        let re = regex::Regex::new(r"(\w+):").unwrap();
        let json_fixed = re.replace_all(arg, r#""$1":"#);

        let parsed: Result<Value, _> = serde_json::from_str(&json_fixed);
        match parsed {
            Ok(json_val) => {
                println!(
                    "[DEBUG] JSON parsed OK:\n{}",
                    serde_json::to_string_pretty(&json_val)?
                );
                let homepage: HomepageSession = serde_json::from_value(json_val)?;
                Ok(homepage)
            }
            Err(e) => {
                eprintln!("[ERROR] serde failed: {}", e);
                eprintln!("[RAW JSON FIXED]\n{}", json_fixed);
                Err(Box::new(e))
            }
        }
    }
}
