const Gio = imports.gi.Gio;
const Util = imports.misc.util;
const GLib = imports.gi.GLib;

const COMMAND_TO_SWITCH_GPU_PROFILE = "pkexec prime-select boot {profile}; gnome-session-quit --reboot";

const EXTENSION_ICON_FILE_NAME = '/img/icon.png';

const GPU_PROFILE_INTEGRATED = "intel";
const GPU_PROFILE_HYBRID = "offload";
const GPU_PROFILE_NVIDIA = "nvidia";


function getCurrentProfile() {
    let [ok, outbuf, err, exit] = GLib.spawn_command_line_sync('prime-select get-current');

    let decoder = new TextDecoder();
    let out = decoder.decode(outbuf);
    log(out);
    let is_nvidia = out.toLowerCase().includes("nvidia");
    let is_intel = out.toLowerCase().includes("intel");

    if (is_nvidia && is_intel)
        return GPU_PROFILE_HYBRID;
    else if (is_nvidia)
        return GPU_PROFILE_NVIDIA;
    else
        return GPU_PROFILE_INTEGRATED;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isBatteryPlugged() {
    const directory = Gio.File.new_for_path('/sys/class/power_supply/');
        // Synchronous, blocking method
    const iter = directory.enumerate_children('standard::*', Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, null);

    while (true) {
        const info = iter.next_file(null);
    
        if (info == null) {
            break;
        }
            
        if(info.get_name().includes("BAT")) {
            return true;
        }
    }
    return false;
}

function _execSwitch(profile) {
    // exec switch
    Util.spawn(['/bin/bash', '-c', COMMAND_TO_SWITCH_GPU_PROFILE
        .replace("{profile}", profile)
    ]);
}

function _isSettingActive(all_settings, setting_name) {
    return all_settings.get_boolean(setting_name) ? "y" : "n";
}

function switchIntegrated() {
    _execSwitch(GPU_PROFILE_INTEGRATED);
}

function switchHybrid(all_settings) {
    _execSwitch(GPU_PROFILE_HYBRID)
}

function switchNvidia(all_settings) {
    _execSwitch(GPU_PROFILE_NVIDIA);
}
