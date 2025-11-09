use std::fmt;

#[derive(Debug, Clone)]
pub struct AccessDeniedError;

impl fmt::Display for AccessDeniedError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "You do not have access to this area or your authorizations are insufficient"
        )
    }
}

impl std::error::Error for AccessDeniedError {}

#[derive(Debug, Clone)]
pub struct AccountDisabledError;

impl fmt::Display for AccountDisabledError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Your account has been deactivated")
    }
}

impl std::error::Error for AccountDisabledError {}

#[derive(Debug, Clone)]
pub struct AuthenticateError(pub String);

impl fmt::Display for AuthenticateError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl std::error::Error for AuthenticateError {}

#[derive(Debug, Clone)]
pub struct BadCredentialsError;

impl fmt::Display for BadCredentialsError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "Unable to resolve the challenge, make sure the credentials or token are correct"
        )
    }
}

impl std::error::Error for BadCredentialsError {}

#[derive(Debug, Clone)]
pub struct BusyPageError;

impl fmt::Display for BusyPageError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "The site is temporarily unavailable")
    }
}

impl std::error::Error for BusyPageError {}

#[derive(Debug, Clone)]
pub struct PageUnavailableError;

impl fmt::Display for PageUnavailableError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "The requested page does not exist")
    }
}

impl std::error::Error for PageUnavailableError {}

#[derive(Debug, Clone)]
pub struct RateLimitedError;

impl fmt::Display for RateLimitedError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "You've been rate-limited")
    }
}

impl std::error::Error for RateLimitedError {}

#[derive(Debug, Clone)]
pub struct ServerSideError(pub String);

impl fmt::Display for ServerSideError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl std::error::Error for ServerSideError {}

impl Default for ServerSideError {
    fn default() -> Self {
        ServerSideError("An error occurred, server-side".to_string())
    }
}

#[derive(Debug, Clone)]
pub struct SourceTooLongError(pub usize);

impl fmt::Display for SourceTooLongError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "Source name is too long, should be less or equal than {} characters",
            self.0
        )
    }
}

impl std::error::Error for SourceTooLongError {}

#[derive(Debug, Clone)]
pub struct SessionExpiredError;

impl fmt::Display for SessionExpiredError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "The session has expired")
    }
}

impl std::error::Error for SessionExpiredError {}

#[derive(Debug, Clone)]
pub struct SuspendedIpError;

impl fmt::Display for SuspendedIpError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Your IP address has been suspended")
    }
}

impl std::error::Error for SuspendedIpError {}

#[derive(Debug, Clone)]
pub struct UnreachableError(pub &'static str);

impl fmt::Display for UnreachableError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "Unhandled code reached in \"{}\" function (pawnote), please report this issue",
            self.0
        )
    }
}

impl std::error::Error for UnreachableError {}
