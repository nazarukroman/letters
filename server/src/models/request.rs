use serde::Deserialize;

#[derive(Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum LetterState {
    Correct,
    Present,
    Absent,
}

#[derive(Deserialize)]
pub struct LetterPattern {
    pub letter: char,
    pub state: LetterState,
    pub position: usize,
}

#[derive(Deserialize)]
#[serde(default)]
pub struct WordSearchRequest {
    pub unique: bool,
    pub random: bool,
    pub count: Option<u32>,
    pub list: Vec<LetterPattern>,
}

impl Default for WordSearchRequest {
    fn default() -> Self {
        Self {
            unique: false,
            random: true,
            count: None,
            list: Vec::new(),
        }
    }
}
