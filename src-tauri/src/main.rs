// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};
use tauri::Manager;
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

fn main() {
    tauri::Builder::default()
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![greet, update_response])
        .setup(|app| {
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

                    warp::serve(routes).run(([127, 0, 0, 1], 80)).await;
                });
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
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
