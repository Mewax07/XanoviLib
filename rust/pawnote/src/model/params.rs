use crate::api::function::{FunctionParametersModel, FunctionParametersResponse};

pub struct Parameters {
    data: FunctionParametersModel,
    signature: Option<crate::api::function::FunctionParametersSignature>,
}

impl Parameters {
    pub fn new(raw: FunctionParametersResponse) -> Result<Self, Box<dyn std::error::Error>> {
        let (data, signature) = raw?;
        Ok(Self { data, signature })
    }

    pub fn navigator_identifier(&self) -> Option<String> {
        self.data.navigator_identifier.clone()
    }

    pub fn signature(&self) -> Option<&crate::api::function::FunctionParametersSignature> {
        self.signature.as_ref()
    }
}
