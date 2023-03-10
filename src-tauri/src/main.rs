// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    CustomMenuItem, GlobalShortcutManager, Manager, SystemTray, SystemTrayMenu, SystemTrayMenuItem,
};

const SHORTCUT_SHOW_HIDE: &str = "CmdOrCtrl+Shift+/";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn build_system_tray() -> SystemTray {
    let sys_tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("toggle_show", "Show/Hide"))
        .add_item(CustomMenuItem::new("settings", "Settings"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "Quit"));

    SystemTray::new().with_menu(sys_tray_menu)
}

fn handle_quit(app: &tauri::AppHandle) {
    app.exit(0);
}

fn handle_show_hide(app: &tauri::AppHandle) {
    let window = create_window_if_not_exist(app, "main", "Main", "index.html")
        .unwrap_or(app.get_window("main").unwrap());

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
    handle_settings(&app);
}

fn handle_settings(app: &tauri::AppHandle) {
    // hide main window
    let window = app.get_window("main").unwrap();
    hide_window(&window);

    create_window_if_not_exist(app, "settings", "Settings", "settings.html");
}

fn create_window_if_not_exist(
    app: &tauri::AppHandle,
    label: &str,
    title: &str,
    url: &str,
) -> Option<tauri::Window> {
    if app.get_window(label).is_none() {
        let window = tauri::WindowBuilder::new(app, label, tauri::WindowUrl::App(url.into()))
            .title(title)
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
                "settings" => handle_settings(app),
                "quit" => handle_quit(app),
                _ => (),
            },
            _ => (),
        })
        .run(tauri::generate_context!())
        .unwrap();
}
