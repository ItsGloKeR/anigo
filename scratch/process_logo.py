from PIL import Image
import numpy as np

img = Image.open(r"C:\Users\Ritesh\.gemini\antigravity\brain\e57fb7c2-77c3-4bed-8721-04dcf2c53139\anixo_logo_exact_1777001655690.png").convert("RGBA")
data = np.array(img)

r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# Black background: all channels very low
is_black = (r < 30) & (g < 30) & (b < 30)

# Make black pixels transparent
data[is_black, 3] = 0

# Also soften near-black (anti-aliasing edges)
is_near_black = (r < 60) & (g < 60) & (b < 60)
# Scale alpha based on darkness
darkness = (60 - r[is_near_black].astype(int))
data[is_near_black, 3] = np.clip((255 * (1 - darkness / 60)), 0, 255).astype(np.uint8)

result = Image.fromarray(data)

# Tight crop to remove any transparent border
bbox = result.getbbox()
if bbox:
    result = result.crop(bbox)

# Tiny padding
padded = Image.new('RGBA', (result.width + 10, result.height + 6), (0,0,0,0))
padded.paste(result, (5, 3))

padded.save(r"C:\Users\Ritesh\Downloads\anigo\public\logo.png")
print(f"Done! Size: {padded.size}")
