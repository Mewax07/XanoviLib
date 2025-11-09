use crate::{
    errors::{
        AccessDeniedError, PageUnavailableError, RateLimitedError, ServerSideError,
        SessionExpiredError, SuspendedIpError,
    }, inflate, session::Session
};
use schwi::HttpResponse;
use serde::de::DeserializeOwned;
use std::cell::RefCell;

pub struct ResponseFunction<'a, DataModel, SignatureModel = ()> {
    pub session: &'a RefCell<Session>,
    _marker: std::marker::PhantomData<(DataModel, SignatureModel)>,
}

impl<'a, DataModel, SignatureModel> ResponseFunction<'a, DataModel, SignatureModel>
where
    DataModel: DeserializeOwned,
    SignatureModel: DeserializeOwned,
{
    pub fn new(session: &'a RefCell<Session>) -> Self {
        Self {
            session,
            _marker: std::marker::PhantomData,
        }
    }

    pub async fn decode(
        &self,
        response: HttpResponse,
    ) -> Result<(DataModel, Option<SignatureModel>), Box<dyn std::error::Error>> {
        let mut session = self.session.borrow_mut();
        session.api.order += 1;

        let content = response.text();

        if content.contains("La page a expir") {
            return Err(Box::new(SessionExpiredError));
        } else if content.contains("Votre adresse IP ") {
            return Err(Box::new(SuspendedIpError));
        } else if content.contains("La page dem") || content.contains("Impossible d'a") {
            return Err(Box::new(PageUnavailableError));
        } else if content.contains("Vous avez d") {
            return Err(Box::new(RateLimitedError));
        } else if content.contains("s refus") {
            return Err(Box::new(AccessDeniedError));
        }

        let json: serde_json::Value = serde_json::from_str(&content)?;

        if let Some(err) = json.get("Erreur") {
            let title = err
                .get("Titre")
                .and_then(|v| v.as_str())
                .unwrap_or("Server Error")
                .to_string();
            return Err(Box::new(ServerSideError(title)));
        }

        let secure_data_key = session
            .api
            .properties
            .get("secureData")
            .ok_or("Missing secureData key")?;
        let mut data = json
            .get(secure_data_key)
            .cloned()
            .ok_or("Missing secureData field")?;

        if let serde_json::Value::String(ref s) = data {
            let mut bytes = hex::decode(s)?;
            if !session.api.skip_encryption {
                bytes = session.aes.decrypt(&bytes);
            }
            if !session.api.skip_compression {
                bytes = inflate(&bytes).await?;
            }
            data = serde_json::from_slice(&bytes)?;
        }

        let signature_key = session.api.properties.get("signature");
        if let Some(sig_key) = signature_key {
            if let Some(sig) = data.get(sig_key) {
                if sig.get("Erreur").is_some() {
                    let msg = sig
                        .get("MessageErreur")
                        .and_then(|v| v.as_str())
                        .unwrap_or("Server Error")
                        .to_string();
                    return Err(Box::new(ServerSideError(msg)));
                }
            }
        }

        // Désérialisation
        let data_key = session
            .api
            .properties
            .get("data")
            .ok_or("Missing data key")?;
        let deserialized_data: DataModel =
            serde_json::from_value(data.get(data_key).cloned().ok_or("Missing data field")?)?;

        let deserialized_signature: Option<SignatureModel> = if let Some(sig_key) = signature_key {
            data.get(sig_key)
                .map(|v| serde_json::from_value(v.clone()))
                .transpose()?
        } else {
            None
        };

        Ok((deserialized_data, deserialized_signature))
    }
}
