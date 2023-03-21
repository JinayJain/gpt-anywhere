pub struct WindowParams {
    label: &'static str,
    title: &'static str,
    url: &'static str,
    min_width_height: Option<(u32, u32)>,
}

impl WindowParams {
    pub fn label(&self) -> &'static str {
        self.label
    }
    pub fn title(&self) -> &'static str {
        self.title
    }
    pub fn url(&self) -> &'static str {
        self.url
    }

    pub fn min_size(&self) -> (u32, u32) {
        self.min_width_height.unwrap_or((200, 100))
    }
}

pub const MAIN_WINDOW: WindowParams = WindowParams {
    label: "main",
    title: "Main",
    url: "index.html",
    min_width_height: Some((500, 300)),
};
pub const SETTINGS_WINDOW: WindowParams = WindowParams {
    label: "settings",
    title: "Settings",
    url: "settings.html",
    min_width_height: Some((500, 300)),
};
pub const HELP_WINDOW: WindowParams = WindowParams {
    label: "help",
    title: "Help",
    url: "help.html",
    min_width_height: Some((500, 300)),
};
