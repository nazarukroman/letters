use serde::Serialize;
use sqlx::FromRow;

#[derive(FromRow, Serialize)]
pub struct WordSearchResult {
    pub word: String,
    pub gender: String,
}
