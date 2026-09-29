#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive

echo "Setting up NOVA ISO Build Environment..."
# Sirf chroot clean karein gy, cache delete nahi karein gy taa ke dobara download na karna paray!
mkdir -p ~/NOVA-ISO
cd ~/NOVA-ISO
# Clean everything so we can build the new Ubuntu 26.04 base from scratch
sudo lb clean || true
sudo rm -rf config .build cache/stages_chroot cache/chroot

# Configure live-build for Ubuntu Resolute (26.04 LTS) to match WSL host GLIBC version
lb config \
  --mode ubuntu \
  --distribution resolute \
  --architecture amd64 \
  --archive-areas "main restricted universe multiverse" \
  --memtest "none" \
  --bootloader "syslinux" \
  --syslinux-theme "live-build" \
  --binary-images "iso-hybrid"

# Copy our compiled NOVA desktop .deb package inside the filesystem
echo "Copying NOVA Desktop package to filesystem..."
mkdir -p config/includes.chroot/opt
cp ~/NOVA/desktop/src-tauri/target/release/bundle/deb/*.deb config/includes.chroot/opt/nova-os.deb

# Create a hook to install it during build
echo "Creating installation hook..."
mkdir -p config/hooks
cat <<EOF > config/hooks/99-install-nova.chroot
#!/bin/sh
export DEBIAN_FRONTEND=noninteractive
echo "Installing NOVA OS package..."
apt-get update
dpkg -i /opt/nova-os.deb || apt-get install -f -y
rm /opt/nova-os.deb
EOF
chmod +x config/hooks/99-install-nova.chroot



echo "Configuring OS packages..."
mkdir -p config/package-lists
cat <<EOF > config/package-lists/nova.list.chroot
xserver-xorg
xserver-xorg-video-all
xinit
matchbox-window-manager
syslinux-utils
isolinux
xorriso
open-vm-tools-desktop
virtualbox-guest-x11
virtualbox-guest-utils
spice-vdagent
EOF

# Configure the OS to automatically log in and start our UI without a password!
echo "Configuring Auto-Boot (Kiosk Mode)..."
mkdir -p config/includes.chroot/etc/systemd/system/getty@tty1.service.d
cat <<EOF > config/includes.chroot/etc/systemd/system/getty@tty1.service.d/override.conf
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin root --noclear %I \$TERM
EOF

mkdir -p config/includes.chroot/root
cat <<EOF > config/includes.chroot/root/.bash_profile
if [ -z "\$DISPLAY" ] && [ "\$(tty)" = "/dev/tty1" ]; then
    startx
fi
EOF

cat <<EOF > config/includes.chroot/root/.xinitrc
# Force fullscreen using matchbox window manager
matchbox-window-manager -use_titlebar no -use_cursor yes &
export WEBKIT_DISABLE_SANDBOX=1
export WEBKIT_DISABLE_COMPOSITING_MODE=1
exec app
EOF

chmod +x config/includes.chroot/root/.bash_profile
chmod +x config/includes.chroot/root/.xinitrc

echo "Ready to build the ISO!"
echo "Building the entire Operating System from scratch..."
echo "(This requires downloading the base Linux system, so it will take 5 to 15 minutes depending on your internet speed)"

# Ensure the WSL host has the syslinux files so we can copy them to templates
sudo apt-get install -y syslinux-utils isolinux xorriso syslinux-common || true

# ============================================================
# FIX: Ubuntu 26.04 coreutils transition breaks apt-get upgrade
# ROOT CAUSE: Bootstrap is CACHED & RESTORED, so config/includes.bootstrap/
# files are NEVER copied to the chroot! We must inject scripts AFTER
# lb bootstrap restores the cache (which creates the chroot/ directory).
# SOLUTION: Use staged build (lb bootstrap → inject → lb chroot → lb binary)
# ============================================================

# Patch live-build script to stop checking for obsolete packages and extracting missing themes!
# FIX Ubuntu 26.04 (Resolute) start-stop-daemon UsrMerge bug breaking dpkg inside chroot
sudo sed -i '/# Create custom start-stop-daemon program/,/chmod 755 chroot\/sbin\/start-stop-daemon/d' /usr/lib/live/build/lb_chroot_dpkg
sudo sed -i '/# Remove custom start-stop-daemon program/,/Chroot chroot dpkg-divert --rename --quiet --remove \/usr\/sbin\/start-stop-daemon/d' /usr/lib/live/build/lb_chroot_dpkg
sudo sed -i 's|Check_package chroot/usr/share/gfxboot-theme-ubuntu/bootlogo.tar.gz gfxboot-theme-ubuntu|echo "Bypassing gfxboot check"|g' /usr/lib/live/build/lb_binary_syslinux
sudo sed -i 's|Check_package chroot/usr/share/syslinux/themes/${LB_SYSLINUX_THEME} syslinux-themes-${LB_SYSLINUX_THEME}|echo "Bypassing syslinux-themes check"|g' /usr/lib/live/build/lb_binary_syslinux
sudo sed -i 's|Chroot chroot "tar xfz /usr/share/gfxboot-theme-ubuntu/bootlogo.tar.gz -C /root/$(basename ${_SOURCE}).tmp"|echo "Bypassing tar"|g' /usr/lib/live/build/lb_binary_syslinux
sudo sed -i 's|tar xfz /usr/share/gfxboot-theme-ubuntu/bootlogo.tar.gz -C ${_TARGET}|echo "Bypassing tar2"|g' /usr/lib/live/build/lb_binary_syslinux
# Fix live-build hardcoding "live" directory instead of "casper" for Ubuntu
sudo sed -i 's|binary/live|binary/casper|g' /usr/lib/live/build/lb_binary_syslinux
sudo sed -i 's|/live/vmlinuz|/casper/vmlinuz|g' /usr/lib/live/build/lb_binary_syslinux
sudo sed -i 's|/live/initrd|/casper/initrd|g' /usr/lib/live/build/lb_binary_syslinux
# Bypass deprecated rsvg command which breaks syslinux splash generation
sudo sed -i 's|rsvg --format png --height 480 --width 640|touch|g' /usr/lib/live/build/lb_binary_syslinux
sudo sed -i 's|splash.svg splash.png|splash.png|g' /usr/lib/live/build/lb_binary_syslinux
# Bypass cpio bootlogo crash since we disabled gfxboot tar extraction
sudo sed -i 's#(cd "$tmpdir" && cpio -i) < ${_TARGET}/bootlogo#true#g' /usr/lib/live/build/lb_binary_syslinux
sudo sed -i 's#(cd "$tmpdir" && ls -1 | cpio --quiet -o) > ${_TARGET}/bootlogo#true#g' /usr/lib/live/build/lb_binary_syslinux

# Fix broken live-build syslinux templates (symlinks to non-existent paths in Jammy)
sudo rm -f /usr/share/live/build/bootloaders/isolinux/isolinux.bin /usr/share/live/build/bootloaders/isolinux/vesamenu.c32 /usr/share/live/build/bootloaders/syslinux/vesamenu.c32
sudo cp /usr/lib/ISOLINUX/isolinux.bin /usr/share/live/build/bootloaders/isolinux/isolinux.bin || true
sudo cp /usr/lib/syslinux/modules/bios/vesamenu.c32 /usr/share/live/build/bootloaders/isolinux/vesamenu.c32 || true
sudo cp /usr/lib/syslinux/modules/bios/vesamenu.c32 /usr/share/live/build/bootloaders/syslinux/vesamenu.c32 || true

# Fix missing syslinux 6.x modules for vesamenu.c32 to work
for mod in ldlinux.c32 libcom32.c32 libutil.c32; do
  sudo cp /usr/lib/syslinux/modules/bios/$mod /usr/share/live/build/bootloaders/isolinux/$mod || true
  sudo cp /usr/lib/syslinux/modules/bios/$mod /usr/share/live/build/bootloaders/syslinux/$mod || true
done

# Fix live-build critical bug: It hardcodes boot=live even when LB_INITRAMFS is casper
sudo sed -i 's|boot=live|boot=casper|g' /usr/share/live/build/bootloaders/isolinux/live.cfg.in || true
sudo sed -i 's|boot=live|boot=casper|g' /usr/share/live/build/bootloaders/syslinux/live.cfg.in || true

echo "====================================================="
echo "STAGE 1: Bootstrap (creates/restores the base chroot)"
echo "====================================================="
sudo lb bootstrap

# ============================================================
# EMERGENCY WRAPPER INJECTION (pre-STAGE 2)
# ============================================================
echo "Injecting emergency 'rm' wrapper via dpkg environment override..."
# We cannot use dpkg-divert for 'rm' because coreutils-from-uutils scripts
# manually manipulate diversions and will crash if they find ours.
# Instead, we force 'apt' to use a custom dpkg wrapper that prepends
# /usr/local/bin to PATH. This guarantees dpkg finds our fallback 'rm'.

sudo mkdir -p chroot/usr/local/bin

# 1. The dpkg wrapper
sudo tee chroot/usr/local/bin/dpkg-wrapper > /dev/null << 'EOF'
#!/bin/sh
export PATH="/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"
exec /usr/bin/dpkg "$@"
EOF
sudo chmod +x chroot/usr/local/bin/dpkg-wrapper

# 2. Configure apt to use our dpkg wrapper
sudo tee chroot/etc/apt/apt.conf.d/99-dpkg-wrapper > /dev/null << 'EOF'
Dir::Bin::dpkg "/usr/local/bin/dpkg-wrapper";
EOF

# 3. The robust fallback wrappers for ALL coreutils commands
for cmd in rm mkdir cp cat readlink uname chmod chown ln mv touch install chgrp rmdir sync md5sum basename dirname mktemp realpath date true false; do
    sudo tee "chroot/usr/local/bin/$cmd" > /dev/null << WRAPPER
#!/bin/sh
for _dir in /usr/bin /bin /usr/lib/cargo/bin/coreutils; do
    if [ -x "\$_dir/$cmd" ] && [ "\$_dir/$cmd" != "\$0" ]; then
        exec "\$_dir/$cmd" "\$@"
    fi
done
if [ -x "/usr/bin/gnu$cmd" ]; then
    exec "/usr/bin/gnu$cmd" "\$@"
fi
WRAPPER

    if [ "$cmd" = "rm" ]; then
        sudo tee -a "chroot/usr/local/bin/$cmd" > /dev/null << 'PYTHON_FALLBACK'
# Fallback to Python if all rm binaries are missing during the transition
/usr/bin/python3 -c '
import sys, shutil, os
for arg in sys.argv[1:]:
    if arg.startswith("-"): continue
    try:
        if os.path.islink(arg) or os.path.isfile(arg):
            os.remove(arg)
        elif os.path.isdir(arg):
            shutil.rmtree(arg)
    except Exception: pass
' "$@"
exit 0
PYTHON_FALLBACK
    else
        sudo tee -a "chroot/usr/local/bin/$cmd" > /dev/null << 'EXIT_FALLBACK'
exit 0
EXIT_FALLBACK
    fi
    sudo chmod +x "chroot/usr/local/bin/$cmd"
done

echo "  Injected dpkg and coreutils fallback wrappers."

# Fix dpkg merged-usr bug which deletes coreutils-from-uutils symlinks during coreutils removal!
# This specifically breaks mkinitramfs, which resets PATH and fails to find 'touch', 'mktemp', etc.
echo "  Diverting mkinitramfs to fix coreutils symlinks..."
sudo chroot chroot dpkg-divert --add --rename --divert /usr/sbin/mkinitramfs.real /usr/sbin/mkinitramfs || true

sudo tee chroot/usr/sbin/mkinitramfs > /dev/null << 'WRAPPER'
#!/bin/sh
# Fix merged-usr dpkg bug which deletes coreutils-from-uutils symlinks!
for cmd in touch readlink mktemp cp mv rm mkdir cat uname chmod chown ln basename dirname realpath date true false sync; do
    if [ ! -e "/usr/bin/$cmd" ] && [ -e "/usr/lib/cargo/bin/coreutils/$cmd" ]; then
        ln -sf "../lib/cargo/bin/coreutils/$cmd" "/usr/bin/$cmd"
    fi
done
exec /usr/sbin/mkinitramfs.real "$@"
WRAPPER
sudo chmod +x chroot/usr/sbin/mkinitramfs

# ============================================================
# PRE-FIX: DASH UPGRADE - REMOVE DIVERSION FROM DPKG DATABASE
#
# PROBLEM: Ubuntu 26.04's new dash postinst checks dpkg's diversions
# database for "/bin/sh" diversion. If found, it calls:
#   dpkg-divert --remove --rename /bin/sh
# This fails with "This should never be reached" because our bootstrap
# chroot has an inconsistent diversion state (diversion entry exists in 
# /var/lib/dpkg/diversions, but /bin/sh.distrib may not exist as expected)
#
# FIX 1 (Primary): Remove the /bin/sh diversion entry DIRECTLY from the
# dpkg diversions database. Then when dash postinst calls:
#   dpkg-divert --list /bin/sh  → returns nothing
# The postinst SKIPS the removal block entirely and goes straight to:
#   update-alternatives --install /usr/bin/sh sh /usr/bin/dash 100  → SUCCESS!
#
# FIX 2 (Secondary): Also ensure /bin/sh exists and is functional.
# ============================================================
echo "PRE-FIX: Removing /bin/sh diversion from dpkg database..."

# Show current state of diversions file
echo "  Current /bin/sh related diversions:"
grep -A2 "^/bin/sh" chroot/var/lib/dpkg/diversions 2>/dev/null || echo "  (none found)"
grep -A2 "^/usr/bin/sh" chroot/var/lib/dpkg/diversions 2>/dev/null || true

# Strategy: Remove ALL diversion entries related to /bin/sh or /usr/bin/sh
# Diversions file format: 3 lines per entry (original, diverted-to, package)
# Example:
#   /bin/sh
#   /bin/sh.distrib
#   dash
if [ -f "chroot/var/lib/dpkg/diversions" ]; then
    # Use Python to safely remove the 3-line blocks for /bin/sh and /usr/bin/sh
    sudo python3 -c "
import re, sys

with open('chroot/var/lib/dpkg/diversions', 'r') as f:
    content = f.read()

lines = content.split('\n')
# Remove 3-line blocks where first line is /bin/sh or /usr/bin/sh
result = []
i = 0
removed = []
while i < len(lines):
    # Diversions file: 3 lines per entry (original_path, diverted_path, package_name)
    # Remove ALL diversions owned by 'dash' package - this covers:
    #   /bin/sh → /bin/sh.distrib by dash
    #   /usr/share/man/man1/sh.1.gz → /usr/share/man/man1/sh.distrib.1.gz by dash
    if i + 2 < len(lines) and lines[i+2].strip() == 'dash':
        removed.append(f'{lines[i]} + {lines[i+1]} + {lines[i+2]}')
        i += 3  # skip all 3 lines of this diversion block
    else:
        result.append(lines[i])
        i += 1

with open('chroot/var/lib/dpkg/diversions', 'w') as f:
    f.write('\n'.join(result))

for r in removed:
    print(f'  Removed diversion: {r}')
if not removed:
    print('  No /bin/sh diversions found to remove')
" 2>/dev/null || true
else
    echo "  /var/lib/dpkg/diversions not found - nothing to remove"
fi

# FIX 2: Ensure /bin/sh exists and points to dash
# (since we removed the diversion, /bin/sh should still be the dash binary)
echo "Verifying /bin/sh status..."
if [ -L "chroot/usr/bin/sh" ] || [ -f "chroot/usr/bin/sh" ]; then
    echo "  /usr/bin/sh exists: $(ls -la chroot/usr/bin/sh 2>/dev/null)"
elif [ -f "chroot/usr/bin/dash" ]; then
    # /bin/sh is missing - create a symlink to dash
    sudo ln -sf /usr/bin/dash chroot/usr/bin/sh 2>/dev/null || true
    echo "  Created: /usr/bin/sh → /usr/bin/dash"
fi

# FIX 3: Pre-create update-alternatives state for sh
# This ensures update-alternatives finds sh already set up, even if dash's
# postinst fails to call it (belt + suspenders approach)
echo "Pre-creating update-alternatives for sh..."
sudo mkdir -p chroot/etc/alternatives
if [ ! -e "chroot/etc/alternatives/sh" ] && [ ! -L "chroot/etc/alternatives/sh" ]; then
    sudo ln -sf /usr/bin/dash chroot/etc/alternatives/sh 2>/dev/null || true
    echo "  Created: /etc/alternatives/sh → /usr/bin/dash"
fi
# Also ensure the admin alternatives database is initialized
sudo mkdir -p chroot/var/lib/dpkg/alternatives
if [ ! -f "chroot/var/lib/dpkg/alternatives/sh" ]; then
    sudo tee chroot/var/lib/dpkg/alternatives/sh > /dev/null << 'ALTFILE'
auto
/usr/bin/sh

/usr/bin/dash
100

ALTFILE
    echo "  Created: /var/lib/dpkg/alternatives/sh"
fi

# ============================================================
# DPKG FORCE OPTIONS: Force overwrite for any remaining conflicts
# Add --force-confold,confdef to avoid interactive prompts
# ============================================================
echo "Configuring dpkg force options for the upgrade..."
sudo mkdir -p chroot/etc/apt/apt.conf.d/
sudo tee chroot/etc/apt/apt.conf.d/99-nova-build-force > /dev/null << 'APTCONF'
// NOVA Build: Force options to handle Ubuntu 22.04 → 26.04 upgrade in live-build chroot
DPkg::Options {
    "--force-confdef";
    "--force-confold";
    "--force-overwrite";
    "--force-remove-reinstreq";
};
APTCONF
echo "  dpkg force options set: confdef, confold, overwrite, remove-reinstreq"

# ============================================================
# SYNC FIXES TO BOOTSTRAP CACHE
# ============================================================
# live-build copies cache/bootstrap to chroot during lb_binary (for the outer chroot).
# If we don't sync these fixes to the cache, the outer chroot will be completely
# unprotected during the second apt-get upgrade phase, causing dpkg to crash again!
if [ -d "cache/bootstrap" ]; then
    echo "Syncing emergency wrappers and fixes to cache/bootstrap..."
    # 1. Sync dpkg and coreutils wrappers
    sudo cp -a chroot/usr/local/bin/* cache/bootstrap/usr/local/bin/ 2>/dev/null || true
    sudo cp -a chroot/etc/apt/apt.conf.d/99-dpkg-wrapper cache/bootstrap/etc/apt/apt.conf.d/ 2>/dev/null || true
    sudo cp -a chroot/etc/apt/apt.conf.d/99-nova-build-force cache/bootstrap/etc/apt/apt.conf.d/ 2>/dev/null || true
    # 2. Sync mkinitramfs diversion
    sudo cp -a chroot/usr/sbin/mkinitramfs cache/bootstrap/usr/sbin/mkinitramfs 2>/dev/null || true
    sudo chroot cache/bootstrap dpkg-divert --add --rename --divert /usr/sbin/mkinitramfs.real /usr/sbin/mkinitramfs 2>/dev/null || true
    # 3. Sync dash /bin/sh fix (the diversions db)
    sudo cp -a chroot/var/lib/dpkg/diversions cache/bootstrap/var/lib/dpkg/diversions 2>/dev/null || true
    sudo cp -a chroot/usr/bin/sh cache/bootstrap/usr/bin/sh 2>/dev/null || true
    sudo cp -a chroot/etc/alternatives/sh cache/bootstrap/etc/alternatives/sh 2>/dev/null || true
    sudo mkdir -p cache/bootstrap/var/lib/dpkg/alternatives
    sudo cp -a chroot/var/lib/dpkg/alternatives/sh cache/bootstrap/var/lib/dpkg/alternatives/sh 2>/dev/null || true
    echo "  Sync complete."
fi

echo "====================================================="
echo "STAGE 2: Chroot (installs packages, runs apt-get upgrade)"
echo "====================================================="
sudo lb chroot


echo "====================================================="
echo "STAGE 3: Binary (creates the ISO image)"
echo "====================================================="
sudo lb binary

echo "Done! The ISO should be created as live-image-amd64.hybrid.iso in ~/NOVA-ISO"
# Copy the ISO back to D drive for easy access
cp *.iso /mnt/d/NOVA/nova-os-v1.iso || true
echo "ISO copied to D:\NOVA\nova-os-v1.iso!"
