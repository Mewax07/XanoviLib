use serde::{Deserialize, Serialize};

use crate::UnreachableError;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[repr(i32)]
pub enum Webspace {
    SeniorManagement = 17,
    Teachers = 8,
    StudentAdministration = 14,
    Parents = 7,
    TeachingAssistants = 26,
    Students = 6,
    Company = 39,
}

impl<'de> Deserialize<'de> for Webspace {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = i32::deserialize(deserializer)?;
        match value {
            17 => Ok(Webspace::SeniorManagement),
            8 => Ok(Webspace::Teachers),
            14 => Ok(Webspace::StudentAdministration),
            7 => Ok(Webspace::Parents),
            26 => Ok(Webspace::TeachingAssistants),
            6 => Ok(Webspace::Students),
            39 => Ok(Webspace::Company),
            _ => Err(serde::de::Error::custom(format!(
                "Unknown Webspace value: {}",
                value
            ))),
        }
    }
}

impl Webspace {
    pub fn from_path(path: &str) -> Result<Self, UnreachableError> {
        let mut segments: Vec<&str> = path.split('.').collect();
        segments.pop();
        match segments.pop() {
            Some("direction") => Ok(Webspace::SeniorManagement),
            Some("professeur") => Ok(Webspace::Teachers),
            Some("viescolaire") => Ok(Webspace::StudentAdministration),
            Some("parent") => Ok(Webspace::Parents),
            Some("accompagnant") => Ok(Webspace::TeachingAssistants),
            Some("eleve") => Ok(Webspace::Students),
            Some("entreprise") => Ok(Webspace::Company),
            _ => Err(UnreachableError("Webspace::from_path")),
        }
    }

    pub fn type_id(&self) -> i32 {
        *self as i32
    }

    pub fn to_mobile_path(&self) -> String {
        let wrap = |name: &str| format!("mobile.{}.html", name);
        match self {
            Webspace::SeniorManagement => wrap("direction"),
            Webspace::Teachers => wrap("professeur"),
            Webspace::StudentAdministration => wrap("viescolaire"),
            Webspace::Parents => wrap("parent"),
            Webspace::TeachingAssistants => wrap("accompagnant"),
            Webspace::Students => wrap("eleve"),
            Webspace::Company => wrap("entreprise"),
        }
    }
}

impl Default for Webspace {
    fn default() -> Self {
        Webspace::Students
    }
}
