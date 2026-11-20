// Point-lookup helper for exported GeoJSON
// Usage in Node or Browser: locatePoint(lon, lat, snapshotGeoJSON)
function pip([px, py], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function locatePolity(lon, lat, snapshot) {
  for (const feature of snapshot.features) {
    if (feature.geometry.type === 'MultiPolygon') {
      for (const poly of feature.geometry.coordinates) {
        if (pip([lon, lat], poly[0])) return feature.properties;
      }
    }
  }
  return null;
}
