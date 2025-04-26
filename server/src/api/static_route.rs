use tower_http::services::{ServeDir, ServeFile};

pub fn service() -> ServeDir {
    let static_dir_path = std::env::var("STATIC_DIR_PATH").unwrap_or_else(|_| "dist".into());

    ServeDir::new(static_dir_path).append_index_html_on_directories(true)
}

pub fn index_html_service() -> ServeFile {
    let static_dir_path = std::env::var("STATIC_DIR_PATH").unwrap_or_else(|_| "dist".into());

    ServeFile::new(format!("{}/index.html", static_dir_path))
}
