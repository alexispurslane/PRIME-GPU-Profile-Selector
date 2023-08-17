const Lang = imports.lang;
const Shell = imports.gi.Shell;
const GLib = imports.gi.GLib;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;

const EXTENSION_NAME = "PRIME_Helper";
const EXTENSION_AUTHOR = "z-ray.de";

const PRIME_RUN = `${GLib.get_home_dir()}/.local/share/gnome-shell/extensions/${EXTENSION_NAME}@${EXTENSION_AUTHOR}/prime-run`

let Aim = imports.ui.appDisplay.AppIconMenu;
let origin;
let launcher_prime;

function enable_app_menu(){
    origin = Aim.prototype._redisplay;
    Aim.prototype._redisplay = function () {
        origin.call(this, arguments);
        let i = 1;

        this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem(), _getNewWindowIndex(this) + i);
        ++i;

        let primeFile = `${GLib.get_home_dir()}/.local/share/gnome-shell/extensions/${EXTENSION_NAME}@${EXTENSION_AUTHOR}/prime`

        _addLauncher(this, "Run With PRIME", primeFile, i);
        ++i;
    }
}

function _addLauncher(self, name, command, i) {
    let launcher = new PopupMenu.PopupMenuItem(_(name));

    self.addMenuItem(launcher, _getNewWindowIndex(self) + i);
    launcher.connect("activate", Lang.bind(self, function () {
        if (self._source.app.state == Shell.AppState.STOPPED) {
            self._source.animateLaunch();
        }

        try {
            let commandArgs = String(_getCommand(self._source.app.get_id()))
            Util.trySpawn([command, commandArgs]);
            self.emit("activate-window", null);
        } catch (error) {
            log(error);
        }
        
    }));
}

function _getNewWindowIndex(self) {
    let appInfo = self._source.app.get_app_info();
    let windows = self._source.app.get_windows();
    let actions = appInfo.list_actions();

    return self._newWindowMenuItem
        ? self._getMenuItems().indexOf(self._newWindowMenuItem)
        : windows.length + actions.length;
}

function _getCommand(file) {
    for (let i in DATA_DIRECTORIES) {
        try {
            let content = GLib.file_get_contents(DATA_DIRECTORIES[i] + file)[1];

            if (content instanceof Uint8Array) {
                content = imports.byteArray.toString(content);
            };

            let line = /Exec=.+/.exec(content)[0];

            return line.substr(5);
        } catch (error) {
            log(error);
        }
    }
}