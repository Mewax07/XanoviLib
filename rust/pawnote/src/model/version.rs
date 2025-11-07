use serde::{Deserialize, Deserializer, Serialize};
use std::fmt;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct Version {
    pub major: u32,
    pub minor: u32,
    pub patch: u32,
}

impl Version {
    pub fn new(major: u32, minor: u32, patch: u32) -> Self {
        Self {
            major,
            minor,
            patch,
        }
    }

    /// Returns true if the version is >= 2024.3.9
    pub fn is_greater_than_or_equal_to_2024_3_9(&self) -> bool {
        if self.major > 2024 {
            return true;
        }
        if self.major < 2024 {
            return false;
        }

        if self.minor > 3 {
            return true;
        }
        if self.minor < 3 {
            return false;
        }

        self.patch >= 9
    }

    /// Returns true if the version is >= 2025.1.3
    pub fn is_greater_than_or_equal_to_2025_1_3(&self) -> bool {
        if self.major > 2025 {
            return true;
        }
        if self.major < 2025 {
            return false;
        }

        if self.minor > 1 {
            return true;
        }
        if self.minor < 1 {
            return false;
        }

        self.patch >= 3
    }
}

impl<'de> Deserialize<'de> for Version {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let v: Vec<u32> = Vec::deserialize(deserializer)?;
        if v.len() != 3 {
            return Err(serde::de::Error::custom(format!(
                "expected array of 3 elements, got {}",
                v.len()
            )));
        }
        Ok(Version {
            major: v[0],
            minor: v[1],
            patch: v[2],
        })
    }
}
