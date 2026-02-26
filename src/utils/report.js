const PLACEHOLDER_HERO_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop&q=80';

const CITY_CENTER_COORDINATES = {
  miami: { lat: 25.76168, lng: -80.19179 },
  'new york city': { lat: 40.71278, lng: -74.00597 },
  austin: { lat: 30.26715, lng: -97.74306 },
  'los angeles': { lat: 34.05223, lng: -118.24368 },
  'san francisco': { lat: 37.77493, lng: -122.41942 },
  chicago: { lat: 41.87811, lng: -87.6298 },
  seattle: { lat: 47.60621, lng: -122.33207 },
  denver: { lat: 39.73924, lng: -104.99025 },
  boston: { lat: 42.36008, lng: -71.05888 },
  nashville: { lat: 36.16266, lng: -86.7816 },
};

export function parseReportResponse(rawResponse) {
  if (typeof rawResponse !== 'string' || !rawResponse.trim()) {
    throw new Error('Empty response body.');
  }

  const cleaned = stripMarkdownFences(rawResponse).trim();

  // Fast path for clean JSON output.
  const direct = tryParseJson(cleaned);
  if (direct) return direct;

  // Common fallback for mixed text around JSON.
  const extractedObject = extractOuterJsonObject(cleaned);
  const parsedExtractedObject = tryParseJson(extractedObject);
  if (parsedExtractedObject) return parsedExtractedObject;

  // Fallback for newline-delimited streams like "data: { ... }".
  const ssePayload = cleaned
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.replace(/^data:\s*/, ''))
    .join('');

  const parsedSsePayload = tryParseJson(stripMarkdownFences(ssePayload));
  if (parsedSsePayload) return parsedSsePayload;

  throw new Error('Response did not contain a valid JSON object.');
}

export function normalizeReportData(input) {
  const region = normalizeRegionAnalysis(input?.region_analysis);
  const properties = Array.isArray(input?.properties)
    ? input.properties.slice(0, 8).map((property, index) => normalizeProperty(property, index, region))
    : [];

  return {
    region_analysis: region,
    properties,
  };
}

function normalizeRegionAnalysis(region) {
  const locationName = safeString(region?.location_name, 'Unknown Market');
  const trendLabel = safeString(region?.market_trend, 'Stable');

  return {
    location_name: locationName,
    market_trend: normalizeTrend(trendLabel),
    average_price_usd: safeNumber(region?.average_price_usd),
    trend_summary: normalizeTrendSummary(region?.trend_summary),
  };
}

function normalizeProperty(property, index, region) {
  const fallbackCoordinates = getCityCenterCoordinates(region.location_name);
  const coordinates = {
    lat: safeNumber(property?.geo_coordinates?.lat) ?? fallbackCoordinates.lat ?? null,
    lng: safeNumber(property?.geo_coordinates?.lng) ?? fallbackCoordinates.lng ?? null,
  };

  return {
    id: safeString(property?.id, `property-${index + 1}`),
    title: safeString(property?.title, 'Untitled Listing'),
    type: safeString(property?.type, 'Property'),
    price_local_currency: safeString(property?.price_local_currency, 'N/A'),
    price_usd: safeNumber(property?.price_usd),
    address: safeString(property?.address, region.location_name),
    beds: safeNumber(property?.beds),
    baths: safeNumber(property?.baths),
    area: safeString(property?.area, 'N/A'),
    geo_coordinates: coordinates,
    features: normalizeFeatures(property?.features),
    hero_image_url: safeString(property?.hero_image_url, PLACEHOLDER_HERO_IMAGE),
    source_url: safeString(property?.source_url, ''),
  };
}

function stripMarkdownFences(value) {
  return String(value)
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '');
}

function extractOuterJsonObject(value) {
  const start = value.indexOf('{');
  const end = value.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    return '';
  }

  return value.slice(start, end + 1);
}

function tryParseJson(value) {
  if (!value || typeof value !== 'string') return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeTrend(value) {
  const lowered = value.toLowerCase();

  if (lowered.includes('rise') || lowered.includes('up') || lowered.includes('hot')) {
    return 'Rising';
  }

  if (
    lowered.includes('declin') ||
    lowered.includes('fall') ||
    lowered.includes('cool') ||
    lowered.includes('down')
  ) {
    return 'Declining';
  }

  return 'Stable';
}

function normalizeTrendSummary(value) {
  const summary = safeString(value, '');
  if (!summary) {
    return 'Market momentum appears mixed, with active demand in quality inventory and moderate pricing pressure in prime submarkets.';
  }
  return summary;
}

function normalizeFeatures(features) {
  if (!Array.isArray(features)) return [];

  return features
    .map((feature) => safeString(feature, ''))
    .filter(Boolean)
    .slice(0, 8);
}

function safeString(value, fallback) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (value == null) return fallback;

  const coerced = String(value).trim();
  return coerced || fallback;
}

function safeNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/,/g, '');
    const match = normalized.match(/-?\d+(\.\d+)?/);
    if (!match) return null;
    const numeric = Number(match[0]);
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
}

function getCityCenterCoordinates(locationName) {
  const lowered = String(locationName || '').toLowerCase();
  const exact = CITY_CENTER_COORDINATES[lowered];
  if (exact) return exact;

  const partial = Object.entries(CITY_CENTER_COORDINATES).find(([city]) =>
    lowered.includes(city)
  );
  return partial ? partial[1] : { lat: null, lng: null };
}
