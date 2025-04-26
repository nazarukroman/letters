use crate::models::request::{LetterPattern, LetterState};
use std::collections::{HashMap, HashSet};

pub fn build_sql(list: &[LetterPattern]) -> (String, Vec<String>) {
    let mut correct: HashMap<usize, HashSet<char>> = HashMap::new();
    let mut present: HashMap<usize, HashSet<char>> = HashMap::new();
    let mut absent: HashSet<char> = HashSet::new();

    for LetterPattern {
        letter,
        state,
        position,
    } in list
    {
        let lowered_letter = letter.to_lowercase().next().unwrap_or(*letter);

        match state {
            LetterState::Correct => {
                correct.entry(*position).or_default().insert(lowered_letter);
            }
            LetterState::Present => {
                present.entry(*position).or_default().insert(lowered_letter);
            }
            LetterState::Absent => {
                absent.insert(lowered_letter);
            }
        }
    }

    absent.retain(|letter| {
        !correct.values().any(|set| set.contains(letter))
            && !present.values().any(|set| set.contains(&letter))
    });

    let mut like_parts = Vec::new();
    let mut params = Vec::new();

    for (position, correct_letter_set) in correct {
        let pattern_mask = PatternMask::new(position);

        for correct_letter in correct_letter_set {
            like_parts.push("AND word LIKE ?".to_string());
            params.push(format!(
                "{}{}{}",
                pattern_mask.head, correct_letter, pattern_mask.tail
            ));
        }
    }

    for (position, present_letter_set) in present {
        let pattern_mask = PatternMask::new(position);

        for present_letter in present_letter_set {
            like_parts.push("AND word NOT LIKE ?".to_string());
            params.push(format!(
                "{}{}{}",
                pattern_mask.head, present_letter, pattern_mask.tail
            ));

            like_parts.push("AND word LIKE ?".to_string());
            params.push(create_any_letter_mask(present_letter));
        }
    }

    for absent_letter in absent {
        like_parts.push("AND word NOT LIKE ?".to_string());
        params.push(create_any_letter_mask(absent_letter.to_owned()));
    }

    (like_parts.join(" "), params)
}

pub struct PatternMask {
    head: String,
    tail: String,
}

impl PatternMask {
    pub fn new(position: usize) -> Self {
        let head = "_".repeat(position);
        let tail = "_".repeat(4 - position);

        PatternMask { head, tail }
    }
}

fn create_any_letter_mask(letter: char) -> String {
    format!("%{}%", letter)
}
