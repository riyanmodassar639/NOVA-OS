#!/bin/bash
set -e

echo "Building Kernel..."
cd kernel
cargo build

KERNEL_PATH=$(pwd)/target/x86_64-unknown-none/debug/nova_kernel
echo "Kernel compiled at $KERNEL_PATH"

cd ../builder
echo "Building Boot Image (Option 2 VESA Framebuffer)..."
cargo run -- "$KERNEL_PATH"

echo "Running in QEMU..."
killall qemu-system-x86_64 2>/dev/null || true
qemu-system-x86_64 -drive format=raw,file=target/nova_os.img
cd ..
