use reqwest::{
    Method, Url,
    header::{HeaderMap as ReqwestHeaderMap, HeaderName, HeaderValue},
};
use serde_json::Value;
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub enum HttpRequestMethod {
    Delete,
    Get,
    Head,
    Options,
    Patch,
    Post,
    Put,
}

impl From<HttpRequestMethod> for Method {
    fn from(method: HttpRequestMethod) -> Self {
        match method {
            HttpRequestMethod::Delete => Method::DELETE,
            HttpRequestMethod::Get => Method::GET,
            HttpRequestMethod::Head => Method::HEAD,
            HttpRequestMethod::Options => Method::OPTIONS,
            HttpRequestMethod::Patch => Method::PATCH,
            HttpRequestMethod::Post => Method::POST,
            HttpRequestMethod::Put => Method::PUT,
        }
    }
}

#[derive(Debug, Clone)]
pub enum HttpRequestRedirection {
    Follow,
    Manual,
}

pub struct HttpRequest {
    pub url: Url,
    pub method: HttpRequestMethod,
    pub body: Option<Vec<u8>>,
    pub headers: ReqwestHeaderMap,
    pub redirection: HttpRequestRedirection,
    pub unauthorized_tls: bool,
}

pub struct HttpRequestBuilder {
    url: Url,
    method: HttpRequestMethod,
    body: Option<Vec<u8>>,
    headers: ReqwestHeaderMap,
    cookies: HashMap<String, String>,
    redirection: HttpRequestRedirection,
    unauthorized_tls: bool,
}

impl HttpRequestBuilder {
    pub fn new(url: &str) -> Self {
        Self {
            url: Url::parse(url).unwrap(),
            method: HttpRequestMethod::Get,
            body: None,
            headers: ReqwestHeaderMap::new(),
            cookies: HashMap::new(),
            redirection: HttpRequestRedirection::Manual,
            unauthorized_tls: false,
        }
    }

    pub fn append_url_search_parameter(mut self, key: &str, value: &str) -> Self {
        self.url.query_pairs_mut().append_pair(key, value);
        self
    }

    pub fn set_url_search_parameter(mut self, key: &str, value: &str) -> Self {
        self.url.query_pairs_mut().append_pair(key, value);
        self
    }

    pub fn delete_url_search_parameter(mut self, key: &str) -> Self {
        let mut pairs: Vec<(String, String)> = self.url.query_pairs().into_owned().collect();
        pairs.retain(|(k, _)| k != key);
        self.url
            .set_query(Some(&serde_urlencoded::to_string(pairs).unwrap()));
        self
    }

    pub fn set_method(mut self, method: HttpRequestMethod) -> Self {
        self.method = method;
        self
    }

    pub fn set_redirection(mut self, redirection: HttpRequestRedirection) -> Self {
        self.redirection = redirection;
        self
    }

    pub fn set_header(mut self, key: &str, value: &str) -> Self {
        self.headers.insert(
            HeaderName::from_bytes(key.as_bytes()).unwrap(),
            HeaderValue::from_str(value).unwrap(),
        );
        self
    }

    pub fn set_cookie(mut self, key: &str, value: &str) -> Self {
        self.cookies.insert(key.to_string(), value.to_string());
        self
    }

    pub fn delete_cookie(mut self, key: &str) -> Self {
        self.cookies.remove(key);
        self
    }

    pub fn delete_all_cookies(mut self) -> Self {
        self.cookies.clear();
        self
    }

    pub fn set_json_body(mut self, json: &Value) -> Self {
        let body_str = serde_json::to_vec(json).unwrap();
        self.body = Some(body_str);
        self.headers.insert(
            reqwest::header::CONTENT_TYPE,
            HeaderValue::from_static("application/json"),
        );
        self
    }

    pub fn set_form_urlencoded_body(mut self, params: &HashMap<&str, &str>) -> Self {
        let body_str = serde_urlencoded::to_string(params).unwrap();
        self.body = Some(body_str.into_bytes());
        self.headers.insert(
            reqwest::header::CONTENT_TYPE,
            HeaderValue::from_static("application/x-www-form-urlencoded"),
        );
        self
    }

    pub fn enable_unauthorized_tls(mut self) -> Self {
        self.unauthorized_tls = true;
        self
    }

    pub fn build(mut self) -> HttpRequest {
        // Serialize cookies
        if !self.cookies.is_empty() {
            let cookies_str = self
                .cookies
                .iter()
                .map(|(k, v)| format!("{}={}", k, v))
                .collect::<Vec<_>>()
                .join("; ");
            self.headers.insert(
                HeaderName::from_static("cookie"),
                HeaderValue::from_str(&cookies_str).unwrap(),
            );
        }

        HttpRequest {
            url: self.url,
            method: self.method,
            body: self.body,
            headers: self.headers,
            redirection: self.redirection,
            unauthorized_tls: self.unauthorized_tls,
        }
    }
}
