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
import * as Utility from '../lib/Utility.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const QuickSettingsMenu = Main.panel.statusArea.quickSettings;

const ICON_SIZE = 6;

const AttachedToBatteryToggle = GObject.registerClass(
class AttachedToBatteryToggle extends QuickSettings.QuickMenuToggle {
    constructor() {
        super();
    }

    _init() {
        const initial = Utility.getCurrentProfile();
        super._init({
            label: Utility.capitalizeFirstLetter(initial),
            gicon: Utility.getIconForProfile(initial),
            title: "GPU",
            subtitle: Utility.capitalizeFirstLetter(initial),
            toggleMode: true,
        });
        
        // This function is unique to this class. It adds a nice header with an
        // icon, title and optional subtitle. It's recommended you do so for
        // consistency with other menus.
        this.menu.setHeader('selection-mode-symbolic', "GPU", 'Switch current GPU');
        
        // You may also add sections of items to the menu
        this._itemsSection = new PopupMenu.PopupMenuSection();

        const nvidiaIcon = Utility.getIconForProfile('nvidia')
        let nvidiaMenuItem = new PopupMenu.PopupImageMenuItem('Nvidia', nvidiaIcon);
        this._itemsSection.addMenuItem(nvidiaMenuItem);
        if (initial == 'nvidia')
            nvidiaMenuItem.setOrnament(PopupMenu.Ornament.CHECK);
        else
            nvidiaMenuItem.setOrnament(PopupMenu.Ornament.NONE);
        nvidiaMenuItem.connect('activate', () => {
            Utility.switchNvidia();

            super.subtitle = 'Nvidia';
            super.gicon = nvidiaIcon;
            nvidiaMenuItem.setOrnament(PopupMenu.Ornament.CHECK);
            intelMenuItem.setOrnament(PopupMenu.Ornament.NONE);
            offloadMenuItem.setOrnament(PopupMenu.Ornament.NONE);
        });

        const offloadIcon = Utility.getIconForProfile('offload');
        let offloadMenuItem = new PopupMenu.PopupImageMenuItem('Offload', offloadIcon);
        this._itemsSection.addMenuItem(offloadMenuItem);
        if (initial == 'offload')
            offloadMenuItem.setOrnament(PopupMenu.Ornament.CHECK);
        else
            offloadMenuItem.setOrnament(PopupMenu.Ornament.NONE);
        offloadMenuItem.connect('activate', () => {
            Utility.switchHybrid();
            super.subtitle = 'Offload';
            super.gicon = offloadIcon;
            offloadMenuItem.setOrnament(PopupMenu.Ornament.CHECK);
            nvidiaMenuItem.setOrnament(PopupMenu.Ornament.NONE);
            intelMenuItem.setOrnament(PopupMenu.Ornament.NONE);
        });

        const intelIcon = Utility.getIconForProfile('intel');
        let intelMenuItem = new PopupMenu.PopupImageMenuItem('Intel', intelIcon);
        this._itemsSection.addMenuItem(intelMenuItem);
        if (initial == 'intel')
            intelMenuItem.setOrnament(PopupMenu.Ornament.CHECK);
        else
            intelMenuItem.setOrnament(PopupMenu.Ornament.NONE);
        intelMenuItem.connect('activate', () => {
            Utility.switchIntegrated();
            super.subtitle = 'Intel';
            super.gicon = intelIcon;
            intelMenuItem.setOrnament(PopupMenu.Ornament.CHECK);
            nvidiaMenuItem.setOrnament(PopupMenu.Ornament.NONE);
            offloadMenuItem.setOrnament(PopupMenu.Ornament.NONE);
        });

        this.menu.addMenuItem(this._itemsSection);

        // Add an entry-point for more settings
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        const settingsItem = this.menu.addAction('More Settings',
            () => Extension.openPreferences());
            
        // Ensure the settings are unavailable when the screen is locked
        settingsItem.visible = Main.sessionMode.allowSettings;
        this.menu._settingsActions[Extension.uuid] = settingsItem;
    }
});

export const AttachedToBatteryView = GObject.registerClass(
class AttachedToBatteryView extends QuickSettings.SystemIndicator {
    _init() {
        super._init();
        // Create the icon for the indicator
        this._indicator = this._addIndicator();
        //this._indicator.gicon = Gio.icon_new_for_string(Me.dir.get_path() + Utility.ICON_SELECTOR_FILE_NAME);
        this._indicator.visible = false;
        
        // Create the toggle and associate it with the indicator, being sure to
        // destroy it along with the indicator
        this.quickSettingsItems.push(new AttachedToBatteryToggle());
        
        // Add the indicator to the panel and the toggle to the menu
        Main.panel.statusArea.quickSettings.addExternalIndicator(this);
    }

    disable() {
        this.quickSettingsItems.forEach(item => item.destroy());
        this._indicator.destroy();
        super.destroy();
    }
});
