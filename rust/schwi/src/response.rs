use reqwest::header::HeaderMap as ReqwestHeaderMap;

pub struct HttpResponse {
    pub url: String,
    pub status: u16,
    pub headers: ReqwestHeaderMap,
    pub body: Vec<u8>,
}

impl HttpResponse {
    pub fn text(&self) -> String {
        String::from_utf8(self.body.clone()).unwrap()
    }

    pub fn json<T: serde::de::DeserializeOwned>(&self) -> T {
        serde_json::from_slice(&self.body).unwrap()
    }
}
