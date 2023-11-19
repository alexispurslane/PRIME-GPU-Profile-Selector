import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';
import St from 'gi://St';
import GObject from 'gi://GObject';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import * as Util from 'resource:///org/gnome/shell/misc/util.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';
import {TopBarView} from './ui/TopBarView.js';
import {AttachedToBatteryView} from './ui/AttachedToBatteryView.js';
import * as Utility from './lib/Utility.js';
import * as FileManagerExtension from './lib/FileManagerExtension.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class PRIMEGPUProfileSelectorExtension extends Extension {
    enable() {
        // if there is no battery, there is no power management panel, so the extension moves to TopBar. If the gnome version is too old to have a quicksettings panel, we also move to the top bar.
        if (Utility.isBatteryPlugged() && QuickSettings != undefined) {
            this.extensionViewTopbar = false
            this.extensionView = new AttachedToBatteryView();
        } else {
            this.extensionViewTopbar = true
            this.extensionView = new TopBarView();
            Main.panel.addToStatusArea("GPU_SELECTOR", this.extensionView, 1);
            this.extensionView.enable();
        }

        //Add / remove file explorer extension.
        const gpu_profile = Utility.getCurrentProfile();
        switch(gpu_profile){
            //Remove file explorer extension if not in offload mode because it can't be used
            default:
                FileManagerExtension.remove_file_manager_extension();
                break;
            //Add file explorer extension only if in offload mode
            case Utility.GPU_PROFILE_HYBRID:
                FileManagerExtension.install_file_manager_extension();
                break;
        }

    }

    disable() {
        this.extensionView.disable();
        // also topbar popup must be destroyed
        if (this.extensionViewTopbar !== null && this.extensionViewTopbar) {
            this.extensionViewTopbar = null
            this.extensionView.destroy();
        }
        this.extensionView = null;
    }
}
