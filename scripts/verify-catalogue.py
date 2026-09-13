import fitz
import os
import sys

PDF_PATH = os.path.join(os.path.dirname(__file__), '../public/catalogue/Akshar-Worldtrade-Export-Catalogue.pdf')
RENDER_DIR = os.path.join(os.path.dirname(__file__), 'rendered_pages')

os.makedirs(RENDER_DIR, exist_ok=True)

if not os.path.exists(PDF_PATH):
    print(f"Error: PDF not found at {PDF_PATH}")
    sys.exit(1)

doc = fitz.open(PDF_PATH)
page_count = len(doc)
print(f"Total pages: {page_count}")
assert page_count == 32, f"Expected 32 pages, got {page_count}"

full_text_per_page = []
for i, page in enumerate(doc):
    text = page.get_text()
    full_text_per_page.append((i + 1, text))

# Check Page 1
p1_text = full_text_per_page[0][1]
expected_p1_line = "Rajkot, Gujarat, India | 46 Products Across Grains & Spices"
if expected_p1_line in p1_text:
    print("PASS: Page 1 contains exact replacement line: 'Rajkot, Gujarat, India | 46 Products Across Grains & Spices'")
else:
    print("FAIL: Page 1 missing exact replacement line!")
    print("Page 1 snippet:", p1_text[:500])

if "Headquarters: Rajkot, Gujarat, India" in p1_text or "Active Export Portfolio: 46 Selected Commodities" in p1_text:
    print("FAIL: Page 1 still contains old portfolio/headquarters line!")
else:
    print("PASS: Page 1 old line successfully removed.")

# Check Country of Origin
coo_found = False
for p_num, text in full_text_per_page:
    if "Country of Origin" in text or "COUNTRY OF ORIGIN" in text:
        print(f"FAIL: Country of Origin found on page {p_num}")
        coo_found = True
if not coo_found:
    print("PASS: Country of Origin absent from all pages.")

# Check repeated bottom line
rep_found = False
for p_num, text in full_text_per_page:
    if "Indian Origin Export Standard | Pre-shipment inspection" in text or "statutory export documentation available per destination country" in text:
        print(f"FAIL: Repeated bottom line found on page {p_num}")
        rep_found = True
if not rep_found:
    print("PASS: Repeated bottom line completely absent.")

# Check Milling Flours
flour_found = False
for p_num, text in full_text_per_page:
    # We permit "Milling flours and processed flour fractions are excluded from this catalogue" on Page 3
    for line in text.split('\n'):
        if "flour" in line.lower() and not "excluded from this catalogue" in line.lower():
            print(f"FAIL: Milling flour product mentioned on page {p_num}: {line}")
            flour_found = True
if not flour_found:
    print("PASS: Milling Flours product count is 0.")

# Check response time promise on Page 32
p32_text = full_text_per_page[31][1]
if "within 1-2 business days" in p32_text or "within 1–2 business days" in p32_text:
    print("FAIL: Response time promise still present on Page 32!")
else:
    print("PASS: Old response time promise removed from Page 32.")

if "Our export desk will review your requirement and respond with the appropriate quotation details." in p32_text:
    print("PASS: Page 32 has correct replacement promise wording.")
else:
    print("FAIL: Page 32 missing correct replacement promise wording!")

# Check LinkedIn links on Page 32
p32 = doc[31]
links = p32.get_links()
admin_linkedin = False
public_linkedin = False
for l in links:
    uri = l.get('uri', '')
    if 'linkedin' in uri:
        if 'admin' in uri or 'dashboard' in uri:
            admin_linkedin = True
            print(f"FAIL: Admin LinkedIn URI found: {uri}")
        else:
            public_linkedin = True
            print(f"PASS: Public LinkedIn URI found: {uri}")
if not admin_linkedin and public_linkedin:
    print("PASS: LinkedIn link is completely public and free of /admin/ or /dashboard/.")

# Check for garbled characters
garbled_found = False
for p_num, text in full_text_per_page:
    if "\ufffd" in text or "\u00d7" in text:
        print(f"FAIL: Garbled character on page {p_num}")
        garbled_found = True
if not garbled_found:
    print("PASS: No garbled or replacement characters found in PDF.")

# Render representative pages to PNG
rep_pages = [1, 2, 4, 8, 15, 24, 29, 30, 31, 32]
print("\nRendering representative pages:")
for p in rep_pages:
    page = doc[p - 1]
    pix = page.get_pixmap(dpi=150)
    out_path = os.path.join(RENDER_DIR, f"page_{p}.png")
    pix.save(out_path)
    print(f"Rendered Page {p} -> {out_path} ({pix.width}x{pix.height})")

print("\nVerification complete!")
