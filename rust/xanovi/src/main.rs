use schwi::{HttpRequestBuilder, HttpRequestMethod, HttpRequestRedirection, send};

#[tokio::main]
async fn main() {
    println!("Hello, world!");

    let req = HttpRequestBuilder::new("https://example.com").set_method(HttpRequestMethod::Get).build();

    println!("Request URL: {}", req.url);

    let req = HttpRequestBuilder::new("https://demo.index-education.net/pronote/eleve.html")
        .set_method(HttpRequestMethod::Get)
        .set_redirection(HttpRequestRedirection::Follow)
        .build();

    match send(req).await {
        Ok(resp) => {
            println!("Status: {}", resp.status);
            println!("URL: {}", resp.url);
            println!("Body: {}", resp.text());
        }
        Err(e) => eprintln!("Request failed: {}", e),
    }
}
