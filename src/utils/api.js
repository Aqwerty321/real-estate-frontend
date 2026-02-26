import { normalizeReportData, parseReportResponse } from './report';

const TOOLHOUSE_URL =
  import.meta.env.VITE_TOOLHOUSE_AGENT_URL ||
  'https://agents.toolhouse.ai/6466f1a4-d24b-49f5-b0c0-cbcd3dafce2c';
const REQUEST_TIMEOUT_MS = 90000;

/**
 * Sends a query to the Toolhouse AI agent and returns normalized JSON data.
 * Returns { data, runId } on success.
 */
export async function fetchMarketReport(message) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(TOOLHOUSE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The request timed out while waiting for Toolhouse.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  const runId = response.headers.get('X-Toolhouse-Run-ID');
  const accumulated = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status}. Response: ${accumulated.slice(0, 400)}`
    );
  }

  try {
    const parsed = parseReportResponse(accumulated);
    const data = normalizeReportData(parsed);
    return { data, runId };
  } catch (error) {
    throw new Error(
      `Failed to parse AI response as JSON: ${error.message}\n\nRaw response:\n${accumulated.slice(0, 500)}`
    );
  }
}

async function readResponseBody(response) {
  if (!response.body) {
    return response.text();
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    accumulated += decoder.decode(value, { stream: true });
  }

  accumulated += decoder.decode();
  return accumulated;
}
