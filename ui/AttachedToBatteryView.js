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
        this.menu.setHeader('selection-mode-symbolic', Utility.capitalizeFirstLetter(Utility.getCurrentProfile()), 'Choose a GPU mode');
        
        // You may also add sections of items to the menu
        this._itemsSection = new PopupMenu.PopupMenuSection();
        this._itemsSection.addAction('Nvidia', () => {
            Utility.switchNvidia();
            super.subtitle = 'Nvidia';
            super.gicon = Utility.getIconForProfile(Utility.getCurrentProfile());
            this.menu.setHeader('selection-mode-symbolic', 'Nvidia (Relog needed)', 'Choose a GPU mode');
        });
        this._itemsSection.addAction('Offload', () => {
            Utility.switchHybrid();
            super.subtitle = 'Offload';
            super.gicon = Utility.getIconForProfile(Utility.getCurrentProfile());
            this.menu.setHeader('selection-mode-symbolic', 'Offload (Relog needed)', 'Choose a GPU mode');
        });
        this._itemsSection.addAction('Intel', () => {
            Utility.switchIntegrated();
            super.subtitle = 'Intel';
            super.gicon = Utility.getIconForProfile(Utility.getCurrentProfile());
            this.menu.setHeader('selection-mode-symbolic', 'Intel (Relog needed)', 'Choose a GPU mode');
        });
        this.menu.addMenuItem(this._itemsSection);

        // Add an entry-point for more settings
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        const settingsItem = this.menu.addAction('More Settings',
            () => ExtensionUtils.openPrefs());
            
        // Ensure the settings are unavailable when the screen is locked
        settingsItem.visible = Main.sessionMode.allowSettings;
        this.menu._settingsActions[Extension.uuid] = settingsItem;
    }
});

const AttachedToBatteryView = GObject.registerClass(
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
        QuickSettingsMenu._indicators.add_child(this);
        QuickSettingsMenu._addItems(this.quickSettingsItems);
    }

    disable() {
        this.quickSettingsItems.forEach(item => item.destroy());
        this._indicator.destroy();
        super.destroy();
    }
});

export default AttachedToBatteryView;
