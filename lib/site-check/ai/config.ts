/**
 * Where the judging model lives.
 *
 * Everything speaks the OpenAI chat-completions shape, Ollama included: it
 * serves that dialect at /v1 alongside its own. Targeting the dialect rather
 * than a vendor is what makes the move from a local model to a paid API a
 * change of environment variables and nothing else. No SDK, no second code
 * path, no adapter layer that has to be kept honest.
 *
 *   Local, während der Entwicklung:
 *     AI_CHECK_BASE_URL=http://localhost:11434/v1
 *     AI_CHECK_MODEL=llama3.2
 *
 *   Später auf dem Server, bei einem Anbieter:
 *     AI_CHECK_BASE_URL=https://<anbieter>/v1
 *     AI_CHECK_MODEL=<modell>
 *     AI_CHECK_API_KEY=<schlüssel>
 *
 * Absent AI_CHECK_BASE_URL the feature is off and the check behaves exactly
 * as it did before. That is deliberate: a deployment that forgets to
 * configure a model should quietly lose the extra section, never fail or
 * hang the report a visitor actually came for.
 */

export const aiBaseUrl = process.env.AI_CHECK_BASE_URL?.replace(/\/+$/, "") ?? "";
export const aiModel = process.env.AI_CHECK_MODEL ?? "llama3.2";
export const aiApiKey = process.env.AI_CHECK_API_KEY ?? "";

export const aiCheckEnabled = aiBaseUrl.length > 0;

/**
 * Local models on a laptop are slow, and this runs while someone watches a
 * spinner. Long enough for a small model to finish a short answer, short
 * enough that a stuck one does not hold the report hostage.
 */
export const AI_TIMEOUT_MS = 25_000;
