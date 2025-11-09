use std::cell::RefCell;

use crate::model::{request::RequestFunction, session::Session};
use crate::{
    FonctionParametresRequest, FunctionParametersModel, FunctionParametersSignature,
    ResponseFunction,
};
use base64::{Engine as _};
use rand::RngCore;
use rsa::traits::{PaddingScheme};
use rsa::{Pkcs1v15Encrypt, RsaPublicKey};

pub type FunctionParametersResponse = Result<
    (FunctionParametersModel, Option<FunctionParametersSignature>),
    Box<dyn std::error::Error>,
>;

pub struct FunctionParameters<'a> {
    session: &'a RefCell<Session>,
    name: &'static str,
    decoder: ResponseFunction<'a, FunctionParametersModel, FunctionParametersSignature>,
    iv: Vec<u8>,
}

impl<'a> FunctionParameters<'a> {
    pub fn new(session: &'a RefCell<Session>) -> Self {
        let iv = vec![0u8; 16];
        Self {
            session,
            name: "FonctionParametres",
            decoder: ResponseFunction::new(session),
            iv,
        }
    }

    fn generate_uuid(&mut self) -> String {
        let binding = self.session.clone();
        let session = binding.borrow();

        rand::thread_rng().fill_bytes(&mut self.iv);
        let mut iv_bytes = self.iv.clone();

        if session.rsa.custom || (!session.rsa.custom && session.homepage.http) {
            iv_bytes = encrypt_rsa(&session.rsa, &iv_bytes);
        }

        base64::engine::general_purpose::STANDARD.encode(iv_bytes)
    }

    pub async fn send(
        &mut self,
        navigator_identifier: Option<String>,
    ) -> FunctionParametersResponse {
        let request = FonctionParametresRequest {
            identifiant_nav: navigator_identifier,
            uuid: self.generate_uuid(),
        };

        let mut session_mut = self.session.borrow_mut();
        let request_fn = RequestFunction::<FonctionParametresRequest>::new(
            &mut session_mut,
            self.name.to_string(),
        );

        let response = request_fn
            .execute(Some(serde_json::to_value(&request).unwrap()), None)
            .await?;

        session_mut.aes.iv = self.iv.clone();

        self.decoder.decode(response).await
    }
}

fn encrypt_rsa(rsa: &crate::model::session::SessionRSA, data: &[u8]) -> Vec<u8> {
    let pubkey = RsaPublicKey::new(rsa.modulus().clone(), rsa.exponent().clone()).unwrap();

    let padding = Pkcs1v15Encrypt;

    padding
        .encrypt(&mut rand::thread_rng(), &pubkey, data)
        .expect("RSA encrypt failed")
}
