#[derive(Debug, Clone, PartialEq, Eq)]
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

	/** @returns true if the version is >= 2024.3.9 */
    pub fn is_greater_than_or_equal_to_2024_3_9(&self) -> bool {
        if self.major > 2024 {
            return true;
        } else if self.major < 2024 {
            return false;
        }

        if self.minor > 3 {
            return true;
        } else if self.minor < 3 {
            return false;
        }

        self.patch >= 9
    }

	/** @returns true if the version is >= 2025.1.3 */
    pub fn is_greater_than_or_equal_to_2025_1_3(&self) -> bool {
        if self.major > 2025 {
            return true;
        } else if self.major < 2025 {
            return false;
        }

        if self.minor > 1 {
            return true;
        } else if self.minor < 1 {
            return false;
        }

        self.patch >= 3
    }
}
