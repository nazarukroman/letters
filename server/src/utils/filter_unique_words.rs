use crate::models::request::LetterPattern;
use crate::models::response::WordSearchResult;
pub use std::collections::HashSet;

pub fn filter_unique_words(
    mut rows: Vec<WordSearchResult>,
    pattern: &[LetterPattern],
) -> Vec<WordSearchResult> {
    let excluded: HashSet<char> = pattern
        .iter()
        .map(|p| p.letter.to_lowercase().next().unwrap_or(p.letter))
        .collect();

    rows.retain(|row| {
        let word = &row.word;
        let mut seen = HashSet::with_capacity(word.len());

        for c in word.chars() {
            let lower_char = c.to_lowercase().next().unwrap_or(c);
            let is_excluded = excluded.contains(&lower_char);
            let is_new = seen.insert(lower_char);

            if is_excluded || !is_new {
                return false;
            }
        }
        true
    });

    rows
}
