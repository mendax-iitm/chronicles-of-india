#!/usr/bin/env python3
"""
Chronicles of India — Headless CLI Map Renderer & Knowledge Tool
Zero external dependencies. Standard library only.

Usage:
  python3 scripts/atlas-cli.py --year 1526
  python3 scripts/atlas-cli.py --year -250 --format json
  python3 scripts/atlas-cli.py --place pataliputra
  python3 scripts/atlas-cli.py --person alexander
  python3 scripts/atlas-cli.py --ruler ashoka
  python3 scripts/atlas-cli.py --search "panipat"
"""

import sys
import json
import math
import argparse
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent

def load_data():
    try:
        with open(ROOT_DIR / "data" / "snapshots.json", "r", encoding="utf-8") as f:
            snapshots = json.load(f)
        with open(ROOT_DIR / "data" / "places.json", "r", encoding="utf-8") as f:
            places = json.load(f)
        with open(ROOT_DIR / "data" / "events.json", "r", encoding="utf-8") as f:
            events = json.load(f)
        with open(ROOT_DIR / "data" / "rulers.json", "r", encoding="utf-8") as f:
            rulers = json.load(f)
        with open(ROOT_DIR / "data" / "journeys.json", "r", encoding="utf-8") as f:
            journeys = json.load(f)
        with open(ROOT_DIR / "data" / "regions.json", "r", encoding="utf-8") as f:
            regions = json.load(f)
        return snapshots, places, events, rulers, journeys, regions
    except Exception as e:
        sys.stderr.write(f"Error loading datasets: {e}\n")
        sys.exit(1)

def fy(y):
    if y is None:
        return ""
    return f"{abs(y)} BCE" if y < 0 else f"{y} CE"

def T(val):
    if not val:
        return ""
    if isinstance(val, str):
        return val
    if isinstance(val, dict):
        return val.get("en") or val.get("hi") or ""
    return str(val)

def render_ascii_map(snapshot, places, year):
    """Render a clean terminal ASCII outline map of South Asia with major cities and imperial markers."""
    # Bounding box roughly: lon 62..96, lat 7..36
    width = 62
    height = 24
    lon_min, lon_max = 62.0, 96.0
    lat_min, lat_max = 7.0, 36.0

    # Grid canvas
    grid = [[" " for _ in range(width)] for _ in range(height)]

    def to_grid(lon, lat):
        gx = int((lon - lon_min) / (lon_max - lon_min) * (width - 1))
        gy = int((lat_max - lat) / (lat_max - lat_min) * (height - 1))
        return gx, gy

    # Schematic coastline points for South Asian subcontinent
    coastline_pts = [
        # Indus delta / Makran
        (62.0, 25.2), (66.5, 24.8), (68.5, 23.5),
        # Gujarat peninsula
        (69.0, 22.5), (70.5, 21.0), (72.5, 21.5),
        # Konkan / Malabar (West coast)
        (72.8, 19.0), (73.5, 16.0), (74.8, 13.0), (76.2, 10.0), (77.5, 8.2),
        # Coromandel / Andhra / Bengal (East coast)
        (79.8, 10.5), (80.3, 13.0), (81.5, 16.0), (85.0, 19.5), (88.0, 22.0),
        # Himalaya northern curve
        (72.0, 34.0), (76.0, 33.0), (80.0, 30.5), (85.0, 28.0), (90.0, 27.5), (94.0, 27.0)
    ]

    for lon, lat in coastline_pts:
        gx, gy = to_grid(lon, lat)
        if 0 <= gx < width and 0 <= gy < height:
            grid[gy][gx] = "."

    # Major active cities in this period
    for p in places:
        # Check if place existed in this year
        names = p.get("names", [])
        if any(n.get("year", -9999) <= year for n in names):
            gx, gy = to_grid(p["lon"], p["lat"])
            if 0 <= gx < width and 0 <= gy < height:
                grid[gy][gx] = "o"

    lines = ["".join(row) for row in grid]
    return "\n".join(lines)

def print_era(snapshots, places, events, rulers, year, output_format):
    y = int(year)
    snap = snapshots[0]
    for s in snapshots:
        if s["from"] <= y:
            snap = s

    active_rulers = [
        r for r in rulers
        if r.get("reign") and r["reign"][0] <= y <= r["reign"][1]
    ]

    contemporary_events = [
        e for e in events
        if abs(e.get("year", 0) - y) <= 25
    ]

    if output_format == "json":
        data = {
            "requested_year": fy(y),
            "snapshot": {
                "id": snap["id"],
                "title": T(snap["title"]),
                "span": f"{fy(snap['from'])}–{fy(snap['to'])}",
                "representative": T(snap.get("representative")),
                "summary": T(snap.get("summary")),
                "polities": [
                    {
                        "name": T(p.get("name")),
                        "color": p.get("color"),
                        "atoms_count": len(p.get("atoms", [])),
                        "atoms": p.get("atoms", []),
                        "note": T(p.get("note"))
                    }
                    for p in snap.get("polities", [])
                ]
            },
            "active_rulers": [
                {
                    "name": T(r.get("name")),
                    "dynasty": T(r.get("dynasty_name")) or r.get("dynasty"),
                    "reign": f"{fy(r['reign'][0])}–{fy(r['reign'][1])}",
                    "capital": r.get("capital")
                }
                for r in active_rulers
            ],
            "contemporary_events": [
                {
                    "year": fy(e.get("year")),
                    "title": T(e.get("title")),
                    "coordinates": [e.get("lon"), e.get("lat")]
                }
                for e in contemporary_events
            ]
        }
        print(json.dumps(data, indent=2, ensure_ascii=False))
        return

    # Terminal ASCII / Text Output
    print("\n" + "=" * 65)
    print(f"  CHRONICLES OF INDIA — HISTORICAL ATLAS ({fy(y)})")
    print("=" * 65)
    print(f"Era:           {T(snap['title'])} ({T(snap.get('representative'))})")
    print(f"Chronology:    {fy(snap['from'])} – {fy(snap['to'])}")
    print(f"Summary:       {T(snap.get('summary'))}")
    print("-" * 65)

    print("\n[ South Asia Map Overview ]")
    print("  (dots indicate mountain/coastal borders; 'o' indicates cities)")
    print(render_ascii_map(snap, places, y))

    print("\nTerritorial Polities & Realms:")
    for idx, p in enumerate(snap.get("polities", []), 1):
        atoms_num = len(p.get("atoms", []))
        note = f" — {T(p['note'])}" if p.get("note") else ""
        print(f"  {idx}. {T(p['name']):<24} [{atoms_num:2d} regions]{note}")

    if active_rulers:
        print("\nActive Monarchs & Dynasties:")
        for r in active_rulers:
            print(f"  👑 {T(r['name']):<22} ({T(r.get('dynasty_name')) or r.get('dynasty')}) · {fy(r['reign'][0])}–{fy(r['reign'][1])}")

    if contemporary_events:
        print("\nNearby Milestones (±25 years):")
        for e in contemporary_events:
            print(f"  ◆ {fy(e['year']):<10} {T(e['title'])}")
    print("=" * 65 + "\n")

def inspect_place(places, events, query):
    q = query.lower().strip()
    place = None
    for p in places:
        if str(p.get("id")).lower() == q:
            place = p
            break
        for n in p.get("names", []):
            if q in T(n.get("name")).lower():
                place = p
                break
        if place:
            break

    if not place:
        print(f"Error: Place '{query}' not found.")
        return

    print("\n" + "=" * 60)
    print(f"  PLACE DOSSIER: {T(place['names'][0]['name'])}")
    print("=" * 60)
    print(f"Category:     {place.get('category', 'settlement').capitalize()}")
    print(f"Coordinates:  {place['lat']}° N, {place['lon']}° E")
    if place.get("lore"):
        print(f"Lore:         {T(place['lore'])}")
    if place.get("capitals"):
        caps = [fy(c) for c in place["capitals"]]
        print(f"Capital in:   {', '.join(caps)}")

    print("\nName Genealogy through the Ages:")
    for n in place.get("names", []):
        note = f" ({T(n['note'])})" if n.get("note") else ""
        print(f"  • {fy(n['year']):<10} {T(n['name'])}{note}")

    # Nearby events
    site_events = [
        e for e in events
        if math.hypot((e["lon"] - place["lon"]) * math.cos(math.radians(place["lat"])), e["lat"] - place["lat"]) < 0.65
    ]
    if site_events:
        print("\nSite Events:")
        for e in sorted(site_events, key=lambda x: x["year"]):
            print(f"  ◆ {fy(e['year']):<10} {T(e['title'])}")
    print("=" * 60 + "\n")

def inspect_person(journeys, query):
    q = query.lower().strip()
    found = None
    for j in journeys:
        if q in T(j.get("who")).lower() or q in T(j.get("title")).lower():
            found = j
            break

    if not found:
        print(f"Error: Traveler or journey '{query}' not found.")
        return

    print("\n" + "=" * 60)
    print(f"  TRAVELER CHRONICLE: {T(found['who'])}")
    print("=" * 60)
    print(f"Expedition:   {T(found['title'])}")
    print(f"Period:       {T(found['years'])}")
    print(f"Summary:      {T(found.get('description'))}")
    print("\nItinerary Stops:")
    for idx, s in enumerate(found.get("stops", []), 1):
        note = f" — {T(s['note'])}" if s.get("note") else ""
        print(f"  {idx:2d}. {fy(s['year']):<10} {T(s['name']):<28} [{s['lat']}°N, {s['lon']}°E]{note}")
    print("=" * 60 + "\n")

def inspect_ruler(rulers, query):
    q = query.lower().strip()
    matches = [
        r for r in rulers
        if q in T(r.get("name")).lower() or q in (T(r.get("dynasty_name")) or r.get("dynasty", "")).lower()
    ]

    if not matches:
        print(f"Error: Ruler '{query}' not found.")
        return

    print("\n" + "=" * 60)
    print(f"  RULER ARCHIVE: {len(matches)} match(es)")
    print("=" * 60)
    for r in matches:
        mid = round((r["reign"][0] + r["reign"][1]) / 2)
        vs = mid + 57 if mid > 0 else mid + 58
        shaka = f"Shaka {mid - 78}" if mid >= 78 else "N/A"
        hijri = f"AH {round((mid - 622) * 1.0307) + 1}" if mid >= 622 else "N/A"
        print(f"Name:         {T(r['name'])}")
        print(f"Dynasty:      {T(r.get('dynasty_name')) or r.get('dynasty')}")
        print(f"Reign Span:   {fy(r['reign'][0])} – {fy(r['reign'][1])}")
        print(f"Capital:      {r.get('capital', 'N/A')}")
        print(f"Regnal Eras:  VS {vs} · {shaka} · {hijri}")
        if r.get("note"):
            print(f"Note:         {T(r['note'])}")
        print("-" * 60)

def search_atlas(snapshots, places, events, rulers, journeys, query):
    q = query.lower().strip()
    print(f"\nSearching atlas for: '{query}'\n")

    # Places
    p_matches = [p for p in places if any(q in T(n.get("name")).lower() for n in p.get("names", []))]
    if p_matches:
        print("Places:")
        for p in p_matches[:5]:
            print(f"  📍 {T(p['names'][0]['name']):<24} [{p['lat']}°N, {p['lon']}°E] ({p.get('category')})")

    # Rulers
    r_matches = [r for r in rulers if q in T(r.get("name")).lower() or q in (T(r.get("dynasty_name")) or r.get("dynasty", "")).lower()]
    if r_matches:
        print("\nRulers:")
        for r in r_matches[:5]:
            print(f"  👑 {T(r['name']):<24} ({T(r.get('dynasty_name')) or r.get('dynasty')}) · {fy(r['reign'][0])}–{fy(r['reign'][1])}")

    # Events
    e_matches = [e for e in events if q in T(e.get("title")).lower() or q in T(e.get("description")).lower()]
    if e_matches:
        print("\nEvents:")
        for e in e_matches[:5]:
            print(f"  ◆ {fy(e['year']):<10} {T(e['title'])}")

    # Journeys
    j_matches = [j for j in journeys if q in T(j.get("title")).lower() or q in T(j.get("who")).lower()]
    if j_matches:
        print("\nJourneys:")
        for j in j_matches[:5]:
            print(f"  🧭 {T(j['who']):<24} — {T(j['title'])} ({T(j['years'])})")
    print()

def main():
    parser = argparse.ArgumentParser(description="Chronicles of India — Headless CLI Knowledge Tool")
    parser.add_argument("--year", type=int, help="Historical year (-600 to 1947)")
    parser.add_argument("--place", type=str, help="Place name or ID to inspect")
    parser.add_argument("--person", type=str, help="Person or journey to inspect")
    parser.add_argument("--ruler", type=str, help="Ruler name to inspect")
    parser.add_argument("--search", type=str, help="Keyword search across atlas")
    parser.add_argument("--format", choices=["text", "json"], default="text", help="Output format")

    args = parser.parse_args()
    snapshots, places, events, rulers, journeys, regions = load_data()

    if args.year is not None:
        print_era(snapshots, places, events, rulers, args.year, args.format)
    elif args.place:
        inspect_place(places, events, args.place)
    elif args.person:
        inspect_person(journeys, args.person)
    elif args.ruler:
        inspect_ruler(rulers, args.ruler)
    elif args.search:
        search_atlas(snapshots, places, events, rulers, journeys, args.search)
    else:
        # Default view: Mauryan Empire at 250 BCE
        print_era(snapshots, places, events, rulers, -250, args.format)

if __name__ == "__main__":
    main()
