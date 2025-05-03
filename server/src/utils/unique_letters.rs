pub use std::collections::HashSet;

pub fn is_unique_letters(word: &String) -> bool {
    let mut seen = HashSet::with_capacity(word.len());

    for c in word.chars() {
        let lower_char = c.to_lowercase().next().unwrap_or(c);

        if !seen.insert(lower_char) {
            return false;
        }
    }
    true
}
