use crate::models::request::{
    LetterPattern, LetterState, WordSearchRequest, WordSearchUniqueResult,
};
use crate::models::response::WordSearchResult;
use crate::sql::BASE_SQL;
use crate::utils::sql_builder::build_sql;
use crate::utils::unique_letters::is_unique_letters;
use axum::{Extension, Json, Router, http::StatusCode, response::IntoResponse, routing::post};
use sqlx::{MySqlPool, query_as};
use std::sync::Arc;
use tower_http::trace::TraceLayer;

pub fn route(db_pool: Arc<MySqlPool>) -> Router {
    Router::new()
        .route("/search", post(search_words))
        .route("/unique", post(search_unique_words))
        .layer(Extension(db_pool))
        .layer(TraceLayer::new_for_http())
}

async fn search_words(
    Extension(db): Extension<Arc<MySqlPool>>,
    maybe_body: Option<Json<WordSearchRequest>>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let body: Json<WordSearchRequest> = maybe_body.map(Json::from).unwrap_or_default();
    let (like_part, params_part) = build_sql(&body.list);
    let mut sql = format!("{} {}", BASE_SQL, like_part);

    if body.random {
        sql.push_str(" ORDER BY RAND()");
    }

    if let Some(count) = body.count {
        sql.push_str(&format!("LIMIT {}", count))
    }

    let mut query = query_as::<_, WordSearchResult>(&sql);

    for param in params_part {
        query = query.bind(param);
    }

    let rows = query.fetch_all(&*db).await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("DB error: {}", e),
        )
    })?;

    Ok((StatusCode::OK, Json(rows)))
}

async fn search_unique_words(
    Extension(db): Extension<Arc<MySqlPool>>,
    maybe_body: Option<Json<WordSearchUniqueResult>>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let body: Json<WordSearchUniqueResult> = maybe_body.map(Json::from).unwrap_or_default();
    let absent_list = body
        .list
        .iter()
        .map(|pattern| LetterPattern {
            letter: pattern.letter,
            position: pattern.position,
            state: LetterState::Absent,
        })
        .collect::<Vec<LetterPattern>>();
    let (like_part, params_part) = build_sql(&absent_list);
    let mut sql = format!("{} {}", BASE_SQL, like_part);

    if let Some(count) = body.count {
        sql.push_str(&format!(" LIMIT {}", count))
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

    rows.retain(|row| is_unique_letters(&row.word));

    Ok((StatusCode::OK, Json(rows)))
}
