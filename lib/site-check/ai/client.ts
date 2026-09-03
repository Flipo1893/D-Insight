import { AI_TIMEOUT_MS, aiApiKey, aiBaseUrl, aiModel } from "./config";

/**
 * One call to a chat-completions endpoint, asking for JSON back.
 *
 * Written against the wire format rather than a vendor SDK. Ollama serves it
 * at /v1, and so does every hosted provider worth using, so the same twenty
 * lines cover the local model today and the paid one later. An SDK would
 * have bought nothing here and would have had to be swapped out at exactly
 * the moment we wanted the change to be free.
 *
 * Returns null on any failure. Callers treat a missing answer as "no opinion
 * available", never as an error worth showing: the visitor asked for their
 * numbers, and our model being unreachable is our problem, not theirs.
 */
export async function askForJson(
  systemPrompt: string,
  userPrompt: string,
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(`${aiBaseUrl}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        // Ollama ignores the header, hosted providers require it. Sending it
        // unconditionally keeps one code path.
        ...(aiApiKey ? { Authorization: `Bearer ${aiApiKey}` } : {}),
      },
      body: JSON.stringify({
        model: aiModel,
        // Judging the same page twice should not produce two different
        // verdicts. Zero does not guarantee that, but it is the closest a
        // sampler gets, and a check whose answer wanders is worth nothing to
        // someone comparing before and after.
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: { message?: { content?: unknown } }[];
    };

    const content = data.choices?.[0]?.message?.content;
    return typeof content === "string" ? content : null;
  } catch {
    // Timeout, refused connection, no model pulled, malformed body. All of
    // them mean the same thing to the caller.
    return null;
  } finally {
    clearTimeout(timer);
  }
}
