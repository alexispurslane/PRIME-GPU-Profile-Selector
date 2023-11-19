import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import * as Util from 'resource:///org/gnome/shell/misc/util.js';

const COMMAND_SET_EXECUTABLE = "chmod +x {scriptPath}"
const SCRIPT_NAME = `prime-run-nautilus`
const dataDir = GLib.get_user_data_dir();
const nautilusExtensionPath = `/nautilus/scripts`
const target = `${dataDir}/gnome-shell/extensions/PRIME_GPU_profile_selector@alexispurslane.github.com/lib/${SCRIPT_NAME}`;

export function install_file_manager_extension(){
    
    let dir = `${dataDir}${nautilusExtensionPath}`;
    let script = Gio.File.new_for_path(GLib.build_filenamev([dir, `Run on nVidia GPU`]));
    

    if (!script.query_exists(null)) {
        GLib.mkdir_with_parents(dir, 0o755);
        script.make_symbolic_link(target, null);
        Util.spawn(['/bin/bash', '-c', COMMAND_SET_EXECUTABLE
            .replace("{scriptPath}", target)
        ]);
    }
}

export function remove_file_manager_extension(){
    let dir = `${dataDir}${nautilusExtensionPath}`;
    let script = Gio.File.new_for_path(GLib.build_filenamev([dir, `Run on nVidia GPU`]));

    if (script.query_exists(null)) {
        script.delete(null);
    }
}
