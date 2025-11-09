use crate::Session;

pub struct PendingLogin {
    pub session: Session,
}

impl PendingLogin {
    pub fn new(session: Session) -> Self {
        Self { session }
    }
}
