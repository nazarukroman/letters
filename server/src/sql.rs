pub const BASE_SQL: &str = r#"
    SELECT word, gender
    FROM nouns
    WHERE CHAR_LENGTH(word) = 5
      AND wcase = 'им'
"#;
