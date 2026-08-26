# -*- coding: utf-8 -*-
"""Packages the project into a zip on the Desktop, excluding heavy/local files."""
import os
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESKTOP = os.path.join(os.path.dirname(ROOT), "Desktop")
OUT = os.path.join(DESKTOP, "veda-ai-grader.zip")

EXCLUDE_DIRS = {"node_modules", ".next", ".vercel", "fonts", ".git", ".turbo"}
EXCLUDE_FILES = {".env.local", "veda-ai-grader.zip", "package-lock.json.bak"}

count = 0
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for name in filenames:
            if name in EXCLUDE_FILES or name.endswith(".zip"):
                continue
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, ROOT)
            z.write(full, os.path.join("veda-ai-grader", rel))
            count += 1

print("Wrote %s (%d files, %.1f KB)" % (OUT, count, os.path.getsize(OUT) / 1024))
