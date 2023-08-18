const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;

const COMMAND_SET_EXECUTABLE = "chmod +x {scriptPath}"
const dataDir = GLib.get_user_data_dir();
const nautilusExtentionPath = `/nautilus/scripts`
const SCRIPT_NAME = `prime-run-nautilus`
const target = `${dataDir}/gnome-shell/extensions/PRIME_Helper@z-ray.de/lib/${SCRIPT_NAME}`;

function install_file_manager_extention(){
    
    let dir = `${dataDir}${nautilusExtentionPath}`;
    let script = Gio.File.new_for_path(GLib.build_filenamev([dir, `Run on nVidia GPU`]));
    

    if (!script.query_exists(null)) {
        GLib.mkdir_with_parents(dir, 0o755);
        script.make_symbolic_link(target, null);
        Util.spawn(['/bin/bash', '-c', COMMAND_SET_EXECUTABLE
            .replace("{scriptPath}", target)
        ]);
    }
}

function remove_file_manager_extention(){
    let dir = `${dataDir}${nautilusExtentionPath}`;
    let script = Gio.File.new_for_path(GLib.build_filenamev([dir, `Run on nVidia GPU`]));

    if (script.query_exists(null)) {
        script.delete(null);
    }
}