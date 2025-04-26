use sqlx::MySqlPool;
use sqlx::mysql::MySqlPoolOptions;

use std::env::var;

pub async fn connect_to_database() -> MySqlPool {
    let user = var("MARIADB_USER").expect("MARIADB_USER environment variable must be set");
    let pass = var("MARIADB_PASSWORD").expect("MARIADB_PASSWORD environment variable must be set");
    let host = var("MARIADB_HOST").expect("MARIADB_HOST environment variable must be set");
    let port = var("MARIADB_PORT").expect("MARIADB_Port environment variable must be set");
    let db_name =
        var("MARIADB_DATABASE").expect("MARIADB_DATABASE environment variable must be set");
    let database_url = format!("mysql://{user}:{pass}@{host}:{port}/{db_name}");

    println!("Database URL here: {}", database_url);

    MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("MySql connection must be created")
}
