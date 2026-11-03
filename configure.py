"""Set your real site URL and GA4 Measurement ID in one go.

Usage:  python configure.py https://yourname.github.io/pausal-tracker G-ABCDE12345
(The GA4 ID is optional: without it the page works, but nothing is measured.)
"""
import sys
from pathlib import Path

OLD_URL = "https://YOUR-USERNAME.github.io/pausal-tracker"
OLD_GA = "G-XXXXXXXXXX"

if len(sys.argv) < 2:
    sys.exit(__doc__)
url = sys.argv[1].rstrip("/")
ga = sys.argv[2] if len(sys.argv) > 2 else None
root = Path(__file__).parent
for f in ["index.html", "ru/index.html", "sitemap.xml", "robots.txt"]:
    p = root / f
    p.write_text(p.read_text(encoding="utf-8").replace(OLD_URL, url), encoding="utf-8")
if ga:
    p = root / "assets/app.js"
    p.write_text(p.read_text(encoding="utf-8").replace(OLD_GA, ga), encoding="utf-8")
print("Done. URL:", url, "| GA4:", ga or "not set")
