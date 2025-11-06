pub mod request;
pub mod response;

pub use request::{HttpRequest, HttpRequestBuilder, HttpRequestMethod, HttpRequestRedirection};
pub use response::HttpResponse;

use reqwest::{Client};
use std::time::Duration;

pub async fn send(request: HttpRequest) -> Result<HttpResponse, reqwest::Error> {
    let client_builder = Client::builder().danger_accept_invalid_certs(request.unauthorized_tls);

    let client = match request.redirection {
        HttpRequestRedirection::Follow => {
            client_builder.redirect(reqwest::redirect::Policy::limited(10))
        }
        HttpRequestRedirection::Manual => {
            client_builder.redirect(reqwest::redirect::Policy::none())
        }
    }
    .timeout(Duration::from_secs(30))
    .build()?;

    let method: reqwest::Method = request.method.into();

    let mut req = client.request(method, request.url.as_str());

    req = req.headers(request.headers.clone());

    if let Some(body) = request.body {
        req = req.body(body);
    }

    let resp = req.send().await?;

    let status = resp.status().as_u16();
    let url = resp.url().to_string();
    let headers = resp.headers().clone();
    let body = resp.bytes().await?.to_vec();

    Ok(HttpResponse {
        url,
        status,
        headers,
        body,
    })
}
