# PRIME GPU Profile Selector GNOME Shell Extension

**based on this extension: <https://github.com/LorenzoMorelli/GPU_profile_selector>**

## Description
A GNOME Shell (version 43 and above) extension which provides a simple way to switch between GPU profiles on Nvidia Optimus systems (i.e laptops with Intel + Nvidia) in a few clicks.

Designed to work with `suse-prime` and similar NVIDIA PRIME implementations, i.e. anything that provides the `prime-select` commands.

## Dependencies
- [bash](https://www.gnu.org/software/bash/)
- [pkexec command](https://command-not-found.com/pkexec)
- `suse-prime`, `fedora-prime`, or (for other Linux distros),
  [nvidia-prime-select](https://github.com/wildtruc/nvidia-prime-select)

## Installation

### Gnome-shell Extension website
- Install all the [dependencies](#Dependencies)
- Enable extension in official [Gnome Extension](https://extensions.gnome.org/extension/5009/prime-gpu-profile-selector/) store

### Manual
- Install all the [dependencies](#Dependencies)
- Clone this repo with:
  ```
  git clone https://github.com/alexispurslane/PRIME-GPU-Profile-Selector.git ~/.local/share/gnome-shell/extensions/PRIME_GPU_profile_selector@alexispurslane.github.com
  ```
## Debuging and packaging

### For looking command line logs
```
journalctl -f -o cat /usr/bin/gnome-shell
```

### For looking updates using wayland (it opens a new wayland session in a window)
```
dbus-run-session -- gnome-shell --nested --wayland
```

### Packaging the extension source for gnome extension website
```
gnome-extensions pack GPU_profile_selector@lorenzo9904.gmail.com \
--extra-source="README.md" \
--extra-source="prefs.xml" \
--extra-source="LICENSE" \
--extra-source="img" \
--extra-source="ui" \
--extra-source="lib"
```
