//! The macOS menu bar: the app, 編輯 and 視窗 menus macOS expects (編輯 is what
//! makes ⌘C／⌘V work in text fields), plus 前往 with 主頁, 台詞本 and 設定. Labels follow the
//! system's language, taken from the app's own translations (src/i18n/locales) so the menu and the
//! side nav say the same thing. Windows has no menu bar: it would sit inside the window, which
//! the boards don't draw.

use serde_json::Value;

/// Emitted with a route (`/`, `/characters`, `/settings`) when a 前往 item is chosen.
pub const NAVIGATE_EVENT: &str = "menu-navigate";

/// Menu item ids for 前往 are this prefix plus the route.
pub const GO_PREFIX: &str = "go:";

/// The app locale nearest a system language tag such as `zh-Hant-TW`, `zh_CN` or `en-US`.
pub fn locale_for(tag: &str) -> &'static str {
    let tag = tag.replace('_', "-").to_ascii_lowercase();
    let mut parts = tag.split('-');
    match parts.next() {
        Some("zh") => {
            let rest: Vec<&str> = parts.collect();
            let traditional = rest
                .iter()
                .any(|p| matches!(*p, "hant" | "tw" | "hk" | "mo"));
            if traditional {
                "zh-Hant"
            } else {
                "zh-Hans"
            }
        }
        Some("ja") => "ja",
        _ => "en",
    }
}

/// One locale's translations.
pub struct Strings(Value);

impl Strings {
    pub fn new(locale: &str) -> Self {
        let json = match locale {
            "zh-Hant" => include_str!("../../src/i18n/locales/zh-Hant.json"),
            "zh-Hans" => include_str!("../../src/i18n/locales/zh-Hans.json"),
            "ja" => include_str!("../../src/i18n/locales/ja.json"),
            _ => include_str!("../../src/i18n/locales/en.json"),
        };
        Self(serde_json::from_str(json).expect("bundled locale files are valid JSON"))
    }

    /// The text at a dotted key such as `menu.go`, with `{{name}}` as the app's name.
    pub fn get(&self, key: &str) -> String {
        let text = key
            .split('.')
            .try_fold(&self.0, |v, k| v.get(k))
            .and_then(Value::as_str)
            .unwrap_or(key);
        text.replace("{{name}}", &self.name())
    }

    /// The app's name in this language.
    pub fn name(&self) -> String {
        self.0["app"]["title"]
            .as_str()
            .unwrap_or("Dialogue Collector")
            .to_owned()
    }
}

/// The menu bar, labelled in the system's language.
#[cfg(target_os = "macos")]
pub fn build<R: tauri::Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<tauri::menu::Menu<R>> {
    use tauri::menu::{AboutMetadata, Menu, MenuItem, PredefinedMenuItem, Submenu};

    let locale = sys_locale::get_locale().map_or("en", |tag| locale_for(&tag));
    let s = Strings::new(locale);
    let name = s.name();
    let text = |key: &str| s.get(key);
    let about = AboutMetadata {
        name: Some(name.clone()),
        version: Some(app.package_info().version.to_string()),
        ..Default::default()
    };

    let app_menu = Submenu::with_items(
        app,
        &name,
        true,
        &[
            &PredefinedMenuItem::about(app, Some(&text("menu.about")), Some(about))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::hide(app, Some(&text("menu.hide")))?,
            &PredefinedMenuItem::hide_others(app, Some(&text("menu.hideOthers")))?,
            &PredefinedMenuItem::show_all(app, Some(&text("menu.showAll")))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::quit(app, Some(&text("menu.quit")))?,
        ],
    )?;
    let edit = Submenu::with_items(
        app,
        text("menu.edit"),
        true,
        &[
            &PredefinedMenuItem::undo(app, Some(&text("menu.undo")))?,
            &PredefinedMenuItem::redo(app, Some(&text("menu.redo")))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::cut(app, Some(&text("menu.cut")))?,
            &PredefinedMenuItem::copy(app, Some(&text("menu.copy")))?,
            &PredefinedMenuItem::paste(app, Some(&text("menu.paste")))?,
            &PredefinedMenuItem::select_all(app, Some(&text("menu.selectAll")))?,
        ],
    )?;
    let go_to = |route: &str, key: &str, accelerator: &str| {
        MenuItem::with_id(
            app,
            format!("{GO_PREFIX}{route}"),
            text(key),
            true,
            Some(accelerator),
        )
    };
    let go = Submenu::with_items(
        app,
        text("menu.go"),
        true,
        &[
            &go_to("/", "nav.home", "CmdOrCtrl+1")?,
            &go_to("/characters", "nav.scriptBook", "CmdOrCtrl+2")?,
            &go_to("/settings", "nav.settings", "CmdOrCtrl+,")?,
        ],
    )?;
    let window = Submenu::with_items(
        app,
        text("menu.window"),
        true,
        &[
            &PredefinedMenuItem::minimize(app, Some(&text("menu.minimize")))?,
            &PredefinedMenuItem::maximize(app, Some(&text("menu.zoom")))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::close_window(app, Some(&text("menu.close")))?,
        ],
    )?;
    Menu::with_items(app, &[&app_menu, &edit, &go, &window])
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn system_languages_map_to_the_app_locales() {
        for (tag, locale) in [
            ("zh-Hant-TW", "zh-Hant"),
            ("zh-TW", "zh-Hant"),
            ("zh_HK", "zh-Hant"),
            ("zh-Hans-CN", "zh-Hans"),
            ("zh-CN", "zh-Hans"),
            ("zh", "zh-Hans"),
            ("ja-JP", "ja"),
            ("en-US", "en"),
            ("fr-FR", "en"),
        ] {
            assert_eq!(locale_for(tag), locale, "{tag}");
        }
    }

    #[test]
    fn every_locale_labels_the_menus() {
        let keys = [
            "nav.home",
            "nav.scriptBook",
            "nav.settings",
            "menu.go",
            "menu.about",
            "menu.hide",
            "menu.hideOthers",
            "menu.showAll",
            "menu.quit",
            "menu.edit",
            "menu.undo",
            "menu.redo",
            "menu.cut",
            "menu.copy",
            "menu.paste",
            "menu.selectAll",
            "menu.window",
            "menu.minimize",
            "menu.zoom",
            "menu.close",
        ];
        for locale in ["zh-Hant", "zh-Hans", "ja", "en"] {
            let s = Strings::new(locale);
            for key in keys {
                let text = s.get(key);
                assert_ne!(text, key, "{locale} lacks {key}");
                assert!(!text.contains("{{"), "{locale} {key}: {text}");
            }
        }
        assert_eq!(Strings::new("zh-Hant").get("menu.go"), "前往");
        assert_eq!(Strings::new("zh-Hant").get("menu.quit"), "結束 台詞收藏家");
        assert_eq!(Strings::new("en").get("nav.scriptBook"), "Script Book");
    }
}
