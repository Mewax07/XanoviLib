use aes::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use md5::{Digest, Md5};
use rsa::RsaPublicKey;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::model::{instance::InstanceInformation, version::Version};

type Aes128CbcEnc = cbc::Encryptor<aes::Aes128>;
type Aes128CbcDec = cbc::Decryptor<aes::Aes128>;

pub struct Session {
    pub rsa: SessionRSA,
    pub aes: SessionAES,
    pub api: SessionAPI,
}

impl Session {
    pub fn new(instance: InstanceInformation, homepage: HomepageSession, _url: String) -> Self {
        let rsa = SessionRSA::new(&homepage);
        let aes = SessionAES::new();
        let api = SessionAPI::new(&homepage, &instance.version);
        Self { rsa, aes, api }
    }
}

pub struct SessionRSA {
    modulus: rsa::BigUint,
    exponent: rsa::BigUint,
    pub custom: bool,
}

impl SessionRSA {
    const DEFAULT_RSA_MODULUS: &str = "0x130337874517286041778445012253514395801341480334668979416920989365464528904618150245388048105865059387076357492684573172203245221386376405947824377827224846860699130638566643129067735803555082190977267155957271492183684665050351182476506458843580431717209261903043895605014125081521285387341454154194253026277";
    const DEFAULT_RSA_EXPONENT: u64 = 65537;

    pub fn new(session: &HomepageSession) -> Self {
        let mut modulus = rsa::BigUint::parse_bytes(
            Self::DEFAULT_RSA_MODULUS
                .trim_start_matches("0x")
                .as_bytes(),
            16,
        )
        .unwrap();
        let mut exponent = rsa::BigUint::from(Self::DEFAULT_RSA_EXPONENT);

        if let Some(m) = &session.rsa_modulus {
            modulus = rsa::BigUint::parse_bytes(m.as_bytes(), 16).unwrap();
        }
        if let Some(e) = &session.rsa_exponent {
            exponent = rsa::BigUint::parse_bytes(e.as_bytes(), 16).unwrap();
        }

        let custom = session.rsa_modulus.is_some() && session.rsa_exponent.is_some();

        Self {
            modulus,
            exponent,
            custom,
        }
    }

    pub fn public_key(&self) -> RsaPublicKey {
        RsaPublicKey::new(self.modulus.clone(), self.exponent.clone()).unwrap()
    }
}

pub struct SessionAES {
    pub iv: Vec<u8>,
    pub key: Vec<u8>,
}

impl SessionAES {
    pub fn new() -> Self {
        Self {
            iv: vec![0; 16],
            key: Vec::new(),
        }
    }

    fn mkey(&self) -> [u8; 16] {
        let mut hasher = Md5::new();
        hasher.update(&self.key);
        let result = hasher.finalize();
        result.into()
    }

    fn miv(&self) -> [u8; 16] {
        if self.iv.iter().all(|&b| b == 0) {
            let mut out = [0u8; 16];
            out.copy_from_slice(&self.iv);
            return out;
        }
        let mut hasher = Md5::new();
        hasher.update(&self.iv);
        hasher.finalize().into()
    }

    pub fn encrypt(&self, input: &[u8]) -> Vec<u8> {
        let mut buf = input.to_vec();

        buf.extend_from_slice(&[0u8; 16]);
        let cipher = Aes128CbcEnc::new(&self.mkey().into(), &self.miv().into());
        let encrypted = cipher
            .encrypt_padded_mut::<Pkcs7>(&mut buf, input.len())
            .expect("Encryption failed");
        encrypted.to_vec()
    }

    pub fn decrypt(&self, data: &[u8]) -> Vec<u8> {
        let mut buf = data.to_vec();
        let cipher = Aes128CbcDec::new(&self.mkey().into(), &self.miv().into());
        let decrypted = cipher
            .decrypt_padded_mut::<Pkcs7>(&mut buf)
            .expect("Invalid padding");
        decrypted.to_vec()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HomepageSession {
    pub id: u64,
    pub webspace: String,
    pub demo: bool,
    pub access: HomepageSessionAccess,

    #[serde(default)]
    pub rsa_modulus: Option<String>,
    #[serde(default)]
    pub rsa_exponent: Option<String>,

    #[serde(default)]
    pub enforce_encryption: bool,
    #[serde(default)]
    pub enforce_compression: bool,

    #[serde(default)]
    pub skip_encryption: bool,
    #[serde(default)]
    pub skip_compression: bool,

    #[serde(default)]
    pub http: bool,
    #[serde(default)]
    pub poll: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum HomepageSessionAccess {
    Account = 0,
    AccountConnection = 1,
    DirectConnection = 2,
    TokenAccountConnection = 3,
    TokenDirectConnection = 4,
    CookieConnection = 5,
}

pub struct SessionAPI {
    pub order: u32,
    pub skip_encryption: bool,
    pub skip_compression: bool,
    pub properties: HashMap<String, String>,
}

impl SessionAPI {
    pub fn new(session: &HomepageSession, version: &Version) -> Self {
        let mut properties = HashMap::new();

        let (skip_encryption, skip_compression) = if version.is_greater_than_or_equal_to_2025_1_3()
        {
            (!session.enforce_encryption, !session.enforce_compression)
        } else {
            (session.skip_encryption, session.skip_compression)
        };

        if version.is_greater_than_or_equal_to_2025_1_3() {
            properties.insert("data".into(), "data".into());
            properties.insert("orderNumber".into(), "no".into());
            properties.insert("secureData".into(), "dataSec".into());
            properties.insert("requestId".into(), "id".into());
            properties.insert("signature".into(), "Signature".into());
            properties.insert("session".into(), "session".into());
        } else if version.is_greater_than_or_equal_to_2024_3_9() {
            properties.insert("data".into(), "data".into());
            properties.insert("signature".into(), "Signature".into());
        } else {
            properties.insert("data".into(), "donnees".into());
            properties.insert("signature".into(), "_Signature_".into());
        }

        Self {
            order: 0,
            skip_encryption,
            skip_compression,
            properties,
        }
    }
}
