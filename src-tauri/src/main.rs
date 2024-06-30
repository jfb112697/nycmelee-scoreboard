// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::sync::{Arc, Mutex};
use tauri::Manager;
use tauri_plugin_sql::{Builder as SqlBuilder, Migration, MigrationKind};
use warp::Filter;

#[derive(Default)]
struct AppState {
    response_string: Arc<Mutex<String>>,
}

#[derive(Serialize, Deserialize)]
struct GraphQLRequest {
    query: String,
    variables: Option<Value>,
}

#[derive(Serialize, Deserialize)]
struct GraphQLResponse {
    data: Option<Value>,
    errors: Option<Value>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn update_response(state: tauri::State<AppState>, new_response: String) {
    let mut response = state.response_string.lock().unwrap();
    *response = new_response;
}

#[tauri::command]
async fn send_graphql_request(
    api_token: String,
    query: String,
    variables: Option<String>,
) -> Result<String, String> {
    let client = Client::new();
    let url = "https://api.start.gg/gql/alpha";

    let variables: Option<Value> = match variables {
        Some(vars) => serde_json::from_str(&vars).map_err(|e| e.to_string())?,
        None => None,
    };

    let request_body = GraphQLRequest { query, variables };

    let request_body_json = serde_json::to_string(&request_body).map_err(|e| e.to_string())?;

    let response = client
        .post(url)
        .bearer_auth(api_token)
        .header("Content-Type", "application/json")
        .body(request_body_json)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let response_text = response.text().await.map_err(|e| e.to_string())?;
    Ok(response_text)
}

async fn handle_rejection(
    err: warp::Rejection,
) -> Result<impl warp::Reply, std::convert::Infallible> {
    eprintln!("Request error: {:?}", err);
    let msg = format!("Error: {:?}", err);
    Ok(warp::reply::with_status(
        msg,
        warp::http::StatusCode::INTERNAL_SERVER_ERROR,
    ))
}

fn main() {
    // Define the migrations
    let migrations = vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: "CREATE TABLE IF NOT EXISTS playernames (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            greet,
            update_response,
            send_graphql_request
        ])
        .setup(|app| {
            println!("Setting up the application...");
            let state = app.state::<AppState>();
            let response_string = state.response_string.clone();

            std::thread::spawn(move || {
                let rt = tokio::runtime::Runtime::new().unwrap();
                rt.block_on(async move {
                    let cors = warp::cors()
                        .allow_any_origin()
                        .allow_methods(vec!["GET", "POST"]);

                    let routes = warp::any()
                        .map(move || {
                            let response = response_string.lock().unwrap().clone();
                            warp::reply::with_header(response, "Access-Control-Allow-Origin", "*")
                        })
                        .with(cors)
                        .recover(handle_rejection);
                    println!("Starting the server on port 80...");
                    warp::serve(routes).run(([127, 0, 0, 1], 80)).await;
                    println!("Server started on port 80");
                });
            });

            Ok(())
        })
        .plugin(
            SqlBuilder::default()
                .add_migrations("sqlite:autocomplete.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_fs_extra::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
