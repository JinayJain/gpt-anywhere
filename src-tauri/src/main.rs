// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use gpt_anywhere::window::{WindowParams, HELP_WINDOW, MAIN_WINDOW, SETTINGS_WINDOW};
use tauri::{
    CustomMenuItem, GlobalShortcutManager, Manager, SystemTray, SystemTrayMenu, SystemTrayMenuItem,
};

const SHORTCUT_SHOW_HIDE: &str = "CmdOrCtrl+Shift+/";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn build_system_tray() -> SystemTray {
    let sys_tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("toggle_show", "Show/Hide"))
        .add_item(CustomMenuItem::new("settings", "Settings"))
        .add_item(CustomMenuItem::new("help", "Help"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "Quit"));

    SystemTray::new().with_menu(sys_tray_menu)
}

fn handle_quit(app: &tauri::AppHandle) {
    app.exit(0);
}

fn handle_show_hide(app: &tauri::AppHandle) {
    let window =
        create_window_if_not_exist(app, MAIN_WINDOW).unwrap_or(app.get_window("main").unwrap());

    show_hide_window(&window);
}

fn show_hide_window(window: &tauri::Window) {
    if window.is_visible().unwrap() {
        hide_window(&window);
    } else {
        show_window(&window);
    }
}

fn hide_window(window: &tauri::Window) {
    window.hide().unwrap();
}

fn show_window(window: &tauri::Window) {
    window.emit("show", ()).unwrap();
    window.show().unwrap();
    window.set_always_on_top(true).unwrap();
    window.center().unwrap();
    window.set_focus().unwrap();
}

#[tauri::command]
fn open_settings(app: tauri::AppHandle) {
    handle_popup(&app, SETTINGS_WINDOW);
}

fn handle_popup(app: &tauri::AppHandle, params: WindowParams) {
    // hide main window
    let window = app.get_window("main").unwrap();
    hide_window(&window);

    create_window_if_not_exist(app, params);
}

fn create_window_if_not_exist(
    app: &tauri::AppHandle,
    params: WindowParams,
) -> Option<tauri::Window> {
    if app.get_window(params.label()).is_none() {
        let window = tauri::WindowBuilder::new(
            app,
            params.label(),
            tauri::WindowUrl::App(params.url().into()),
        )
        .title(params.title())
        .center()
        .build();

        window.ok()
    } else {
        None
    }
}

fn main() {
    let sys_tray = build_system_tray();

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .system_tray(sys_tray)
        .setup(|app| {
            // get window
            let window = app.get_window("main").unwrap();

            app.global_shortcut_manager()
                .register(SHORTCUT_SHOW_HIDE, move || {
                    show_hide_window(&window);
                })
                .unwrap();

            // setup code here
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![open_settings])
        .on_system_tray_event(|app, event| match event {
            tauri::SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "toggle_show" => handle_show_hide(app),
                "settings" => handle_popup(app, SETTINGS_WINDOW),
                "help" => handle_popup(app, HELP_WINDOW),
                "quit" => handle_quit(app),
                _ => (),
            },
            _ => (),
        })
        .run(tauri::generate_context!())
        .unwrap();
}
