// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{GlobalShortcutManager, Manager};

const SHORTCUT_SHOW_HIDE: &str = "CmdOrCtrl+Shift+/";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // get window
            let window = app.get_window("main").unwrap();

            app.global_shortcut_manager()
                .register(SHORTCUT_SHOW_HIDE, move || {
                    if window.is_visible().unwrap() {
                        window.hide().unwrap();
                    } else {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                        window.set_always_on_top(true).unwrap();
                        window.center().unwrap();
                    }
                })
                .unwrap();

            // setup code here
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
