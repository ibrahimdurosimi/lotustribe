import zlib
import struct
import math
import os

def create_png(width, height, get_pixel):
    raw = bytearray()
    for y in range(height):
        raw.append(0) # filter type 0 (None)
        for x in range(width):
            r, g, b, a = get_pixel(x, y, width, height)
            raw.extend([r, g, b, a])
    
    compressed = zlib.compress(bytes(raw), 9)
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png.extend(struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc))
    
    # IDAT
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png.extend(struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc))
    
    # IEND
    iend_crc = zlib.crc32(b'IEND')
    png.extend(struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc))
    return bytes(png)

def draw_lotus(x, y, w, h, maskable=False):
    # Normalized coords -1 to 1
    nx = (x / w) * 2 - 1
    ny = (y / h) * 2 - 1
    
    # Scale factor (maskable needs larger padding, artwork fits in safe zone)
    art_scale = 0.52 if maskable else 0.65
    sx = nx / art_scale
    sy = (ny + 0.05) / art_scale  # slight vertical offset for balance
    
    # Background gradient: Lotus Red #A31D1D to deep crimson #7A1212
    r_bg = math.sqrt(nx*nx + ny*ny)
    t_bg = min(1.0, r_bg)
    bg_r = int(163 * (1 - t_bg * 0.25))
    bg_g = int(29 * (1 - t_bg * 0.35))
    bg_b = int(29 * (1 - t_bg * 0.35))
    
    # Rounded rect corner mask if not maskable
    if not maskable:
        # Corner radius check (~20% corner radius)
        corner_r = 0.22
        cx = abs(nx) - (1.0 - corner_r)
        cy = abs(ny) - (1.0 - corner_r)
        if cx > 0 and cy > 0:
            if math.sqrt(cx*cx + cy*cy) > corner_r:
                return (0, 0, 0, 0) # Transparent outside rounded icon
    
    # Check lotus flower geometry
    # 1. Center petal: teardrop shape centered at x=0
    # Equation: x^2 / a^2 + (y - y0)^2 / b^2 <= 1, pinched at top
    in_center_petal = False
    if -0.32 < sx < 0.32 and -0.75 < sy < 0.45:
        # Width narrows towards top sy = -0.75
        rel_y = (sy - (-0.75)) / 1.2
        if 0 < rel_y <= 1:
            max_w = 0.28 * math.sin(rel_y * math.pi) * (0.8 + 0.2 * rel_y)
            if abs(sx) <= max_w:
                in_center_petal = True
                
    # 2. Left and Right mid petals
    in_mid_petals = False
    for sign in [-1, 1]:
        # Rotate coordinates
        theta = sign * 0.45
        cos_t = math.cos(theta)
        sin_t = math.sin(theta)
        # origin around (sign * 0.1, 0.15)
        rx = cos_t * (sx - sign * 0.1) - sin_t * (sy - 0.15)
        ry = sin_t * (sx - sign * 0.1) + cos_t * (sy - 0.15)
        if -0.25 < rx < 0.25 and -0.65 < ry < 0.4:
            rel_y = (ry - (-0.65)) / 1.05
            if 0 < rel_y <= 1:
                max_w = 0.22 * math.sin(rel_y * math.pi)
                if abs(rx) <= max_w:
                    in_mid_petals = True
                    
    # 3. Outer left and right sweeping petals
    in_outer_petals = False
    for sign in [-1, 1]:
        theta = sign * 0.95
        cos_t = math.cos(theta)
        sin_t = math.sin(theta)
        rx = cos_t * (sx - sign * 0.15) - sin_t * (sy - 0.28)
        ry = sin_t * (sx - sign * 0.15) + cos_t * (sy - 0.28)
        if -0.2 < rx < 0.2 and -0.55 < ry < 0.35:
            rel_y = (ry - (-0.55)) / 0.9
            if 0 < rel_y <= 1:
                max_w = 0.18 * math.sin(rel_y * math.pi)
                if abs(rx) <= max_w:
                    in_outer_petals = True

    # 4. Base support pedestal / crescent
    in_base = False
    if -0.65 < sx < 0.65 and 0.25 < sy < 0.55:
        # Crescent curve
        base_curve = 0.28 + 0.18 * (sx / 0.65) ** 2
        base_curve_bottom = 0.38 + 0.25 * (sx / 0.65) ** 2
        if base_curve <= sy <= base_curve_bottom:
            in_base = True

    # 5. Inner golden seed / glow at the heart
    dist_heart = math.sqrt(sx*sx + (sy - 0.15)**2)
    in_heart = dist_heart < 0.12

    if in_heart:
        # Golden core #FDE047
        return (253, 224, 71, 255)
    elif in_center_petal or in_mid_petals or in_outer_petals or in_base:
        # Lotus white / cream with slight shading
        # Petal gradient: brighter at top, slightly warm at bottom
        light = min(1.0, max(0.0, 1.0 - (sy + 0.5) * 0.25))
        petal_r = int(255 * light + 245 * (1 - light))
        petal_g = int(255 * light + 240 * (1 - light))
        petal_b = int(255 * light + 235 * (1 - light))
        return (petal_r, petal_g, petal_b, 255)
    else:
        # Background
        return (bg_r, bg_g, bg_b, 255)

os.makedirs('public', exist_ok=True)

print("Generating pwa-192x192.png...")
png_192 = create_png(192, 192, lambda x, y, w, h: draw_lotus(x, y, w, h, False))
with open('public/pwa-192x192.png', 'wb') as f:
    f.write(png_192)

print("Generating pwa-512x512.png...")
png_512 = create_png(512, 512, lambda x, y, w, h: draw_lotus(x, y, w, h, False))
with open('public/pwa-512x512.png', 'wb') as f:
    f.write(png_512)

print("Generating pwa-maskable-512x512.png...")
png_maskable = create_png(512, 512, lambda x, y, w, h: draw_lotus(x, y, w, h, True))
with open('public/pwa-maskable-512x512.png', 'wb') as f:
    f.write(png_maskable)

print("Generating apple-touch-icon.png...")
png_apple = create_png(180, 180, lambda x, y, w, h: draw_lotus(x, y, w, h, False))
with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(png_apple)

print("All icons successfully generated in public/!")
