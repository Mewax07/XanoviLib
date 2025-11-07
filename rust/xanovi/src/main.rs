use pawnote::Instance;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let instance = Instance::from_url("https://demo.index-education.net/pronote/eleve.html");
    println!("Base URL: {}", instance.base);

    let info = instance.get_information().await?;
    println!("{:#?}", info);

    Ok(())
}
