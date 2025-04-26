use sqlx::MySqlPool;
use sqlx::mysql::MySqlPoolOptions;

use std::env;

pub async fn connect_to_database() -> MySqlPool {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env");

    MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("MySql connection must be created")
}
