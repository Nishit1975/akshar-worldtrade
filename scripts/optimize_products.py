import os
import json
import urllib.request
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
TEMP_DIR = os.path.join(SCRIPT_DIR, 'temp_webp')
os.makedirs(TEMP_DIR, exist_ok=True)

AUDIT_PATH = os.path.join(SCRIPT_DIR, 'audit_results.json')
with open(AUDIT_PATH, 'r', encoding='utf-8') as f:
    audit_data = json.load(f)

products = audit_data.get('results', [])
print(f"Loaded {len(products)} products from {AUDIT_PATH}")

MAX_WIDTH = 1200
WEBP_QUALITY = 85

optimized_results = []
total_old_size = 0
total_new_size = 0

for idx, p in enumerate(products, 1):
    pid = p['id']
    name = p['name']
    url = p['url']
    old_size = p['sizeBytes']
    total_old_size += old_size

    temp_input = os.path.join(TEMP_DIR, f"{pid}_orig.png")
    temp_output = os.path.join(TEMP_DIR, f"{pid}.webp")

    # Download original image if not already cached
    if not os.path.exists(temp_input):
        urllib.request.urlretrieve(url, temp_input)

    # Process and convert using Pillow
    with Image.open(temp_input) as img:
        orig_w, orig_h = img.size
        # Resize if width > MAX_WIDTH
        if orig_w > MAX_WIDTH:
            new_w = MAX_WIDTH
            new_h = int(round((MAX_WIDTH / orig_w) * orig_h))
            img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        else:
            img_resized = img.copy()

        # Save to WebP
        img_resized.save(temp_output, 'WEBP', quality=WEBP_QUALITY, method=6)

    new_size = os.path.getsize(temp_output)
    total_new_size += new_size
    reduction = ((old_size - new_size) / old_size) * 100

    optimized_results.append({
        'id': pid,
        'name': name,
        'oldUrl': url,
        'oldSizeBytes': old_size,
        'oldSizeMB': round(old_size / (1024 * 1024), 2),
        'newSizeBytes': new_size,
        'newSizeKB': round(new_size / 1024, 2),
        'reductionPercent': round(reduction, 1),
        'localWebpPath': temp_output,
        'destStoragePath': f"{pid}/main/optimized.webp",
        'newUrl': f"https://cesbnetuuwzwvflmjbcs.supabase.co/storage/v1/object/public/product-images/{pid}/main/optimized.webp"
    })

    print(f"[{idx}/{len(products)}] {name}: {round(old_size/(1024*1024), 2)}MB -> {round(new_size/1024, 2)}KB ({reduction:.1f}% off)")

# Optimize local category assets
category_assets = [
    ('grains-cereals.png', 'grains-cereals.webp'),
    ('spices-seasonings.png', 'spices-seasonings.webp'),
]

cat_results = []
for src_name, dst_name in category_assets:
    src_path = os.path.join(WORKSPACE_ROOT, 'src', 'assets', src_name)
    dst_path = os.path.join(WORKSPACE_ROOT, 'src', 'assets', dst_name)
    if os.path.exists(src_path):
        old_cat_size = os.path.getsize(src_path)
        with Image.open(src_path) as img:
            orig_w, orig_h = img.size
            if orig_w > MAX_WIDTH:
                new_w = MAX_WIDTH
                new_h = int(round((MAX_WIDTH / orig_w) * orig_h))
                img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            else:
                img_resized = img.copy()
            img_resized.save(dst_path, 'WEBP', quality=WEBP_QUALITY, method=6)
        new_cat_size = os.path.getsize(dst_path)
        cat_red = ((old_cat_size - new_cat_size) / old_cat_size) * 100
        cat_results.append({
            'source': src_name,
            'dest': dst_name,
            'oldSizeMB': round(old_cat_size / (1024 * 1024), 2),
            'newSizeKB': round(new_cat_size / 1024, 2),
            'reductionPercent': round(cat_red, 1)
        })
        print(f"Asset {src_name}: {round(old_cat_size/(1024*1024), 2)}MB -> {round(new_cat_size/1024, 2)}KB ({cat_red:.1f}% off)")

summary = {
    'totalProducts': len(products),
    'totalOldSizeBytes': total_old_size,
    'totalOldSizeMB': round(total_old_size / (1024 * 1024), 2),
    'totalNewSizeBytes': total_new_size,
    'totalNewSizeMB': round(total_new_size / (1024 * 1024), 2),
    'totalReductionPercent': round(((total_old_size - total_new_size) / total_old_size) * 100, 1),
    'products': optimized_results,
    'categoryAssets': cat_results
}

out_summary_path = os.path.join(SCRIPT_DIR, 'optimized_summary.json')
with open(out_summary_path, 'w', encoding='utf-8') as f:
    json.dump(summary, f, indent=2)

print("\n--- Summary ---")
print(f"Products optimized: {len(products)}")
print(f"Total old size: {summary['totalOldSizeMB']} MB")
print(f"Total new size: {summary['totalNewSizeMB']} MB")
print(f"Total savings: {summary['totalReductionPercent']}%")
print(f"Results saved to: {out_summary_path}")
