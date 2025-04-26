use crate::api::{api_routes, static_route};
use axum::Router;
use axum::routing::get_service;
use sqlx::MySqlPool;
use std::sync::Arc;

pub fn create_router(pool: MySqlPool) -> Router {
    let db_pool = Arc::new(pool);

    Router::new()
        .route("/", get_service(static_route::index_html_service()))
        .nest("/api", api_routes::route(db_pool))
        .nest_service("/static", static_route::service())
}
