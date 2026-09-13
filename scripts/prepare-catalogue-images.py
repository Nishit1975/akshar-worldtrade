import os
import sys
import json
import urllib.request
import io
from PIL import Image

# 1. Read Supabase credentials from .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
if not os.path.exists(env_path):
    print(f"Error: .env file not found at {env_path}")
    sys.exit(1)

env = {}
with open(env_path, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()

supabase_url = env.get('VITE_SUPABASE_URL', '').rstrip('/')
supabase_key = env.get('VITE_SUPABASE_PUBLISHABLE_KEY') or env.get('VITE_SUPABASE_ANON_KEY')

if not supabase_url or not supabase_key:
    print("Error: Supabase URL or key missing in .env")
    sys.exit(1)

# 2. Fetch all products from Supabase
query_url = (
    f"{supabase_url}/rest/v1/products?"
    "select=id,name,slug,short_description,category_id,subcategory_id,main_image,specifications,packaging,moq,origin,status,"
    "categories(id,name,slug),subcategories(id,name,slug)&order=created_at.asc"
)

headers = {
    'apikey': supabase_key,
    'Authorization': f"Bearer {supabase_key}"
}

print("Fetching active products from Supabase...")
req = urllib.request.Request(query_url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        all_products = json.loads(resp.read().decode('utf-8'))
except Exception as e:
    print(f"Error querying Supabase: {e}")
    sys.exit(1)

print(f"Total products returned from Supabase: {len(all_products)}")

# 3. Filter out Milling Flours (case-insensitive check for 'flour' in category name)
active_products = [
    p for p in all_products
    if not (p.get('categories') and 'flour' in p['categories'].get('name', '').lower())
]

print(f"Active export products (excluding Milling Flours): {len(active_products)}")

# Verify the count is exactly 46
if len(active_products) != 46:
    print(f"WARNING: Expected 46 active export products, found {len(active_products)}!")

# 4. Prepare cache directory
cache_dir = os.path.join(os.path.dirname(__file__), 'cache_images')
os.makedirs(cache_dir, exist_ok=True)

# 5. Download and convert each WebP image to high-quality JPEG
cached_products = []

for idx, prod in enumerate(active_products):
    pid = prod['id']
    name = prod['name']
    img_url = prod.get('main_image')
    out_jpeg_path = os.path.join(cache_dir, f"{pid}.jpg")

    cat_name = prod.get('categories', {}).get('name', 'Grains & Cereals')
    subcat_name = prod.get('subcategories', {}).get('name') if prod.get('subcategories') else ''
    
    # Check if image is already cached
    if os.path.exists(out_jpeg_path) and os.path.getsize(out_jpeg_path) > 1000:
        print(f"[{idx+1}/{len(active_products)}] Already cached: {name}")
    else:
        if not img_url:
            print(f"[{idx+1}/{len(active_products)}] WARNING: No image URL for {name}")
        else:
            print(f"[{idx+1}/{len(active_products)}] Downloading & converting image for: {name}...")
            try:
                img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(img_req) as img_resp:
                    img_data = img_resp.read()
                
                with Image.open(io.BytesIO(img_data)) as im:
                    if im.mode in ('RGBA', 'LA', 'P'):
                        # Convert to RGB with white background
                        bg = Image.new('RGB', im.size, (255, 255, 255))
                        if im.mode == 'P':
                            im = im.convert('RGBA')
                        bg.paste(im, mask=im.split()[3] if im.mode == 'RGBA' else None)
                        im = bg
                    elif im.mode != 'RGB':
                        im = im.convert('RGB')
                    
                    # Resize if unreasonably huge (maintain aspect ratio, max dimension 1200)
                    max_dim = 1200
                    if max(im.size) > max_dim:
                        im.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                    
                    im.save(out_jpeg_path, format='JPEG', quality=92, optimize=True)
                print(f"   -> Saved {out_jpeg_path} ({os.path.getsize(out_jpeg_path)} bytes)")
            except Exception as e:
                print(f"   -> ERROR downloading/converting {name}: {e}")

    cached_products.append({
        'id': pid,
        'name': name,
        'slug': prod.get('slug', ''),
        'category': cat_name,
        'subcategory': subcat_name,
        'short_description': prod.get('short_description', ''),
        'packaging': prod.get('packaging', ''),
        'moq': prod.get('moq', ''),
        'origin': prod.get('origin', 'India'),
        'specifications': prod.get('specifications') or {},
        'cached_image': out_jpeg_path if os.path.exists(out_jpeg_path) else None,
        'main_image_url': img_url
    })

# 6. Save products metadata JSON for generate-catalogue.js
json_out_path = os.path.join(cache_dir, 'products.json')
with open(json_out_path, 'w', encoding='utf-8') as f:
    json.dump(cached_products, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully prepared {len(cached_products)} active export products!")
print(f"Products metadata saved to: {json_out_path}")
