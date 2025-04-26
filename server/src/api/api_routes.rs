use crate::api::words_routes;
use axum::Router;
use sqlx::MySqlPool;
use std::sync::Arc;

pub fn route(db_pool: Arc<MySqlPool>) -> Router {
    Router::new().nest("/words", words_routes::route(db_pool))
}
