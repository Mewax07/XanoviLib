use std::collections::HashMap;

use crate::{Session, UA, deflate};

use schwi::{send, HttpRequestBuilder, HttpRequestMethod, HttpResponse};
use serde::Serialize;
use serde_json::{Map, Value};

pub struct RequestFunction<'a, Data, Signature = ()> {
    pub session: &'a mut Session,
    pub name: String,
    _marker: std::marker::PhantomData<(Data, Signature)>,
}

impl<'a, Data, Signature> RequestFunction<'a, Data, Signature>
where
    Data: Serialize,
    Signature: Serialize,
{
    pub fn new(session: &'a mut Session, name: impl Into<String>) -> Self {
        Self {
            session,
            name: name.into(),
            _marker: std::marker::PhantomData,
        }
    }

    async fn properties_to_payload(
        &self,
        properties: HashMap<String, serde_json::Value>,
    ) -> Result<serde_json::Value, Box<dyn std::error::Error>> {
        let mut payload_bytes: Option<Vec<u8>> = None;

        if !self.session.api.skip_compression || !self.session.api.skip_encryption {
            let json_bytes = serde_json::to_vec(&properties)?;
            payload_bytes = Some(json_bytes);
        }

        if !self.session.api.skip_compression {
            let buffer = payload_bytes
                .take()
                .map(|b| hex::encode(b).into_bytes())
                .unwrap_or_default();
            payload_bytes = Some(deflate(&buffer).await?);
        }

        if !self.session.api.skip_encryption {
            if let Some(ref mut buf) = payload_bytes {
                *buf = self.session.aes.encrypt(buf);
            }
        }

        if let Some(payload) = payload_bytes {
            Ok(serde_json::Value::String(hex::encode(payload)))
        } else {
            Ok(serde_json::to_value(properties)?)
        }
    }

    pub async fn execute(
        &self,
        data: Option<serde_json::Value>,
        signature: Option<serde_json::Value>,
    ) -> Result<HttpResponse, Box<dyn std::error::Error>> {
        let mut session = self.session.clone();
        session.api.order += 1;

        let order_bytes = session.aes.encrypt(&session.api.order.to_be_bytes());
        let order_hex = hex::encode(order_bytes);

        let url = format!(
            "{}/appelfonction/{}/{}/{}",
            session.url, session.homepage.webspace.type_id(), session.homepage.id, order_hex
        );

        let mut properties: HashMap<String, serde_json::Value> = HashMap::new();
        if let Some(d) = data {
            let key = session.api.properties.get("data").unwrap();
            properties.insert(key.clone(), d);
        }
        if let Some(s) = signature {
            let key = session.api.properties.get("signature").unwrap();
            properties.insert(key.clone(), s);
        }

        let payload = self.properties_to_payload(properties).await?;

        let mut map = Map::new();
        map.insert(
            session.api.properties.get("session").unwrap().clone(),
            Value::Number(session.homepage.id.into()),
        );
        map.insert(
            session.api.properties.get("orderNumber").unwrap().clone(),
            Value::String(order_hex),
        );
        map.insert(
            session.api.properties.get("requestId").unwrap().clone(),
            Value::String(self.name.clone()),
        );
        map.insert(
            session.api.properties.get("secureData").unwrap().clone(),
            payload,
        );

        let json_body = Value::Object(map);

        let request = HttpRequestBuilder::new(&url)
            .set_method(HttpRequestMethod::Post)
            .set_header("Content-Type", "application/json")
            .set_header("User-Agent", UA)
            .set_json_body(&json_body)
            .build();

        Ok(send(request).await?)
    }
}
