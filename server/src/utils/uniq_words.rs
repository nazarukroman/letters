pub use std::collections::HashSet;

pub fn is_word_with_uniq_letters(word: &str) -> bool {
    let mut seen = HashSet::with_capacity(word.len());

    for c in word.chars() {
        let lower = c.to_lowercase().next().unwrap_or(c);

        if !seen.insert(lower) {
            return false;
        }
    }
    true
}
