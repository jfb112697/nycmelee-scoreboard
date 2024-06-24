// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};
use tauri::Manager;
use tauri_plugin_sql::{Builder as SqlBuilder, Migration, MigrationKind};
use warp::Filter;

#[derive(Default)]
struct AppState {
    response_string: Arc<Mutex<String>>,
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
        .invoke_handler(tauri::generate_handler![greet, update_response])
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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
