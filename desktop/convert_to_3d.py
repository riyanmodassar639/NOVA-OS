from PIL import Image
import json
import os
import math

def image_to_points(image_path, output_path, max_size=100, depth_scale=0.3):
    if not os.path.exists(image_path):
        print(f"File not found: {image_path}")
        return
        
    img = Image.open(image_path).convert('L')
    img.thumbnail((max_size, max_size))
    
    width, height = img.size
    points = []
    
    for y in range(height):
        for x in range(width):
            brightness = img.getpixel((x, y))
            if brightness > 40: # Threshold
                px = (x / width) * 2 - 1
                py = -((y / height) * 2 - 1)
                
                # Z curve
                dist_from_center_x = abs(px)
                curve = math.cos(dist_from_center_x * math.pi / 2)
                
                pz = (brightness / 255.0) * curve * depth_scale
                
                points.extend([px, py, pz])
                # Adding symmetry for front/back to simulate full 3D object
                if pz > 0.05:
                    points.extend([px, py, -pz])
                
    with open(output_path, 'w') as f:
        json.dump(points, f)
        
    print(f"Saved {len(points)//3} points to {output_path}")

image_dir = r"d:\NOVA\desktop\public\biometrics"
data_dir = r"d:\NOVA\desktop\src\data"
os.makedirs(data_dir, exist_ok=True)

image_to_points(os.path.join(image_dir, "body_pro.jpg"), os.path.join(data_dir, "body_points.json"), max_size=150, depth_scale=0.5)
image_to_points(os.path.join(image_dir, "face_pro.jpg"), os.path.join(data_dir, "face_points.json"), max_size=150, depth_scale=0.6)
image_to_points(os.path.join(image_dir, "eye_pro.jpg"), os.path.join(data_dir, "eye_points.json"), max_size=120, depth_scale=0.1)
image_to_points(os.path.join(image_dir, "fingerprint_pro.jpg"), os.path.join(data_dir, "fingerprint_points.json"), max_size=120, depth_scale=0.05)
