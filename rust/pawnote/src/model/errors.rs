use std::fmt;

#[derive(Debug, Clone)]
pub struct UnreachableError(pub &'static str);

impl fmt::Display for UnreachableError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "UnreachableError: {}", self.0)
    }
}

impl std::error::Error for UnreachableError {}