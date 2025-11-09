use std::error::Error;

use uuid::Uuid;

use crate::{Instance, LoginPortal, PendingLogin, Webspace};

pub struct StudentLoginPortal {
    instance: Instance,
}

impl StudentLoginPortal {
    pub fn new(instance: Instance) -> Self {
        Self { instance }
    }

    pub fn instance(&self) -> &Instance {
        &self.instance
    }

    pub async fn credentials(
        &self,
        username: &str,
        password: &str,
        device_uuid: Option<String>,
        navigator_identifier: Option<String>,
    ) -> Result<PendingLogin, Box<dyn Error>> {
        let device_uuid = device_uuid.unwrap_or_else(|| Uuid::new_v4().to_string());

        self._credentials(
            Webspace::Students,
            username,
            password,
            &device_uuid,
            navigator_identifier.as_deref(),
        )
        .await
    }
}

#[async_trait::async_trait]
impl LoginPortal for StudentLoginPortal {
    fn instance(&self) -> &Instance {
        &self.instance
    }
}