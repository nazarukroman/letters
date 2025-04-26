use crate::models::request::{WordSearchOptions, WordSearchRequest};
use crate::models::response::WordSearchResult;
use crate::sql::BASE_SQL;
use crate::utils::sql_builder::build_sql;
use crate::utils::uniq_words::is_word_with_uniq_letters;
use axum::{
    Extension, Json, Router, extract::Query, http::StatusCode, response::IntoResponse,
    routing::post,
};
use sqlx::{MySqlPool, query_as};
use std::sync::Arc;
use tower_http::trace::TraceLayer;

pub fn route(db_pool: Arc<MySqlPool>) -> Router {
    Router::new()
        .route("/search", post(search_words))
        .layer(Extension(db_pool))
        .layer(TraceLayer::new_for_http())
}

async fn search_words(
    Extension(db): Extension<Arc<MySqlPool>>,
    options: Query<WordSearchOptions>,
    maybe_body: Option<Json<WordSearchRequest>>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let body: Json<WordSearchRequest> = maybe_body.map(Json::from).unwrap_or_default();
    let (like_part, params_part) = build_sql(&body.list);
    let mut sql = format!("{} {}", BASE_SQL, like_part);

    if options.random {
        sql.push_str(" ORDER BY RAND()");
    }

    if let Some(count) = options.count {
        sql.push_str(&format!("LIMIT {}", count))
    }

    let mut query = query_as::<_, WordSearchResult>(&sql);

    for param in params_part {
        query = query.bind(param);
    }

    let mut rows = query.fetch_all(&*db).await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("DB error: {}", e),
        )
    })?;

    if options.unique {
        rows.retain(|row| is_word_with_uniq_letters(&row.word));
    }

    Ok((StatusCode::OK, Json(rows)))
}
