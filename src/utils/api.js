const TOOLHOUSE_URL = 'https://agents.toolhouse.ai/6466f1a4-d24b-49f5-b0c0-cbcd3dafce2c';

/**
 * Sends a query to the Toolhouse AI agent and streams the response.
 * Returns { data, runId } on success.
 */
export async function fetchMarketReport(message, existingRunId = null) {
    const body = { message };

    const url = TOOLHOUSE_URL;
    const method = existingRunId ? 'PUT' : 'POST';

    if (existingRunId) {
        body.runId = existingRunId;
    }

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    // Extract run ID from headers
    const runId = response.headers.get('X-Toolhouse-Run-ID') || existingRunId;

    // Stream-read the response body
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
    }

    // Strip markdown code fences if present
    let cleaned = accumulated.trim();
    // Remove ```json ... ``` or ``` ... ```
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
    cleaned = cleaned.trim();

    // Parse JSON
    let data;
    try {
        data = JSON.parse(cleaned);
    } catch (e) {
        throw new Error(`Failed to parse AI response as JSON: ${e.message}\n\nRaw response:\n${accumulated.substring(0, 500)}`);
    }

    return { data, runId };
}
