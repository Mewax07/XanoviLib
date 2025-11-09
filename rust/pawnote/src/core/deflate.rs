use flate2::{write::DeflateEncoder, Compression};
use std::io::Write;

pub async fn deflate(input: &[u8]) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let mut encoder = DeflateEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(input)?;
    Ok(encoder.finish()?)
}
