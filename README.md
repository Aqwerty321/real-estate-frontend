# Meridian Real Estate Intelligence Frontend

React + Vite frontend for a premium real estate dashboard powered by a Toolhouse agent.

## What this app does
- Builds a structured natural-language query from UI filters.
- Sends the query to a Toolhouse agent endpoint.
- Parses streamed output into JSON.
- Normalizes response data to a stable schema for rendering.
- Displays market intelligence metrics and listing cards.

## Tech stack
- React 19
- Vite 8
- Tailwind CSS 4
- Framer Motion
- Lucide icons

## Run locally
```bash
npm install
npm run dev
```

## Build and lint
```bash
npm run lint
npm run build
```

## Environment configuration
Set the Toolhouse endpoint in `.env`:

```bash
VITE_TOOLHOUSE_AGENT_URL="https://agents.toolhouse.ai/<your-agent-id>"
VITE_UI_EXPERIENCE="cinematic" # or "legacy"
```

If unset, the app falls back to the hardcoded default agent URL in `src/utils/api.js`.

## Response contract
The UI expects this top-level shape:

```json
{
  "region_analysis": {
    "location_name": "string",
    "market_trend": "Rising | Stable | Declining",
    "average_price_usd": 0,
    "trend_summary": "string"
  },
  "properties": [
    {
      "id": "string",
      "title": "string",
      "type": "string",
      "price_local_currency": "string",
      "price_usd": 0,
      "address": "string",
      "beds": 0,
      "baths": 0,
      "area": "string",
      "geo_coordinates": { "lat": 0, "lng": 0 },
      "features": ["string"],
      "hero_image_url": "string",
      "source_url": "string"
    }
  ]
}
```

Normalization logic lives in `src/utils/report.js` and provides safe defaults when the model output is incomplete or noisy.

## Recommended Toolhouse system prompt
Use the maintained prompt at:
- `docs/toolhouse-system-prompt.md`
