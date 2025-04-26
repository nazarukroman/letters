use tower_http::services::ServeDir;

pub fn service() -> ServeDir {
    let static_dir_path = std::env::var("STATIC_DIR_PATH").unwrap_or_else(|_| "dist".into());

    ServeDir::new(static_dir_path)
}
