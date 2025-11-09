use pawnote::{Instance, StudentLoginPortal};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let instance = Instance::from_url("https://demo.index-education.net/pronote/eleve.html");
    println!("Base URL: {}", instance.base);

    let portal = StudentLoginPortal::new(instance);
    let auth = portal
        .credentials("demonstration", "pronotevs", None, None)
        .await?;

    Ok(())
}
