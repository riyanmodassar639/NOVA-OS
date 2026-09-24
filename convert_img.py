import sys
from PIL import Image

def convert_image(img_path, out_path, size=(600, 600)):
    try:
        img = Image.open(img_path)
        img = img.resize(size, Image.Resampling.LANCZOS)
        img = img.convert('RGB')
        
        with open(out_path, 'wb') as f:
            f.write(img.tobytes())
            
        print(f"Successfully converted image to {out_path} ({size[0]}x{size[1]} RGB)")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    img_path = r"C:\Users\hp\.gemini\antigravity\brain\1ac8f12e-02a1-4577-b847-c2b2d1ced35d\.user_uploaded\media_1788122237764.jpg"
    out_path = r"D:\NOVA\kernel\src\logo.bin"
    convert_image(img_path, out_path)
