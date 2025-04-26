mod api;
mod database_connection;
mod models;
mod router;
mod sql;
mod utils;

use crate::database_connection::connect_to_database;
use crate::utils::init_tracing::init_tracing;
use dotenvy::dotenv;
use router::create_router;

#[tokio::main]
async fn main() {
    dotenv().ok();
    init_tracing();

    let db_pool = connect_to_database();
    let main_router = create_router(db_pool.await);
    let port = std::env::var("SERVER_PORT").unwrap_or("4000".to_string());

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();

    println!("listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, main_router).await.unwrap();
}
