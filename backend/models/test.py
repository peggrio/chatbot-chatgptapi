# script.py
import os
from PIL import Image, ImageDraw, ImageFont

def generate_image(text, uuid):
    img = Image.new('RGB', (200, 100), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((10, 10), text, fill=(0, 0, 0))

    # Get the current directory of the script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create the 'testimage' folder if it doesn't exist
    output_dir = os.path.join(current_dir, 'testimage')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Save the image in the 'testimage' folder
    output_path = os.path.join(output_dir, f'{uuid}.png')

    img.save(output_path)

if __name__ == "__main__":
    import sys
    text_input = sys.argv[1]
    uuid = sys.argv[2]
    generate_image(text_input, uuid)
    print('Image generated successfully')