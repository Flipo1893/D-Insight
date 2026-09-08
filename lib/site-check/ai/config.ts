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
 * How long one question may take.
 *
 * Twenty seconds is generous for a hosted model: measured against
 * gpt-4o-mini, a full assessment of four questions came back in 3 to 8
 * seconds total. It is deliberately not generous for a local one. llama3.2
 * on this machine needed 40 to 119 seconds for the same four questions, and
 * a value that covered that would also let one stuck request eat the whole
 * budget on a deployed server, where the platform kills the function before
 * we ever get to answer.
 *
 * So the default is sized for the deployed case, and anyone running a slow
 * local model raises it in their own environment rather than everyone
 * carrying the cost of that case.
 */
const timeoutFromEnv = Number(process.env.AI_CHECK_TIMEOUT_MS);
export const AI_TIMEOUT_MS =
  Number.isFinite(timeoutFromEnv) && timeoutFromEnv > 0
    ? timeoutFromEnv
    : 20_000;
