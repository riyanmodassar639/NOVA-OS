@echo off
set TEMP=D:\NOVA\temp
set TMP=D:\NOVA\temp
mkdir D:\NOVA\temp 2>NUL

echo Building Kernel...
cd kernel
cargo build
if %errorlevel% neq 0 (
    echo Kernel build failed!
    pause
    exit /b %errorlevel%
)

set KERNEL_PATH=%CD%\target\x86_64-unknown-none\debug\nova_kernel
echo Kernel compiled at %KERNEL_PATH%

cd ..\builder
echo Building Boot Image (Option 2 VESA Framebuffer)...
cargo run -- "%KERNEL_PATH%"
if %errorlevel% neq 0 (
    echo Boot image build failed!
    pause
    exit /b %errorlevel%
)

echo Running in QEMU...
taskkill /IM qemu-system-x86_64.exe /F 2>NUL
"C:\Program Files\qemu\qemu-system-x86_64.exe" -drive format=raw,file=target\nova_os.img
cd ..
pause
