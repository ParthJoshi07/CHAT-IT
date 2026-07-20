from rembg import remove
from PIL import Image

input_path = r"c:\Users\Fireon99\Desktop\All in one\Chat IT\QuickChat-Full-Stack\client\public\logo.png"
output_path = r"c:\Users\Fireon99\Desktop\All in one\Chat IT\QuickChat-Full-Stack\client\public\logo_bg_removed.png"

print("Starting background removal...")
input_img = Image.open(input_path)
output_img = remove(input_img)
output_img.save(output_path)
print("Background removed successfully!")
