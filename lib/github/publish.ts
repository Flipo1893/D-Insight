/**
 * Schreibt die Texte eines Kunden in das Repository seiner Website.
 *
 * Kundenseiten lesen ihre Texte beim Bauen aus einer JSON-Datei im eigenen
 * Repository, nicht beim Besuch über unsere Content-API. Speichert der Kunde
 * im Dashboard, schreibt diese Datei die neue Fassung per GitHub-API, Vercel
 * sieht den Commit und baut die Seite neu.
 *
 * Der Grund ist Ausfallsicherheit. Liest eine Kundenseite zur Laufzeit bei
 * uns nach, fehlen auf jeder Kundenseite die Texte, sobald D-Insight oder
 * die Datenbank hakt. So hängt die Kundenseite nach dem Bauen von niemandem
 * mehr ab; bei einem Ausfall geht nur das Speichern nicht.
 *
 * Der Kunde sieht davon nichts. Für ihn ist es ein Formular mit Speichern.
 */

const apiBase = (process.env.GITHUB_API_URL ?? "https://api.github.com").replace(
  /\/+$/,
  "",
);
const token = process.env.GITHUB_CONTENT_TOKEN ?? "";

export const isGithubPublishConfigured = token.length > 0;

export const DEFAULT_CONTENT_PATH = "content/site.json";

/** Besitzer bis 39 Zeichen wie bei GitHub, Name ohne Schrägstrich. */
const REPO_PATTERN = /^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9._-]{1,100}$/;

const TIMEOUT_MS = 15_000;

/**
 * "besitzer/name" aus dem, was jemand ins Feld tippt oder einfügt.
 *
 * Wer eine Adresse aus dem Browser kopiert, bekommt die volle URL, oft mit
 * .git am Ende. Beides wird angenommen, statt jemanden beim Einrichten mit
 * einer Fehlermeldung aufzuhalten, deren Lösung wir selbst kennen.
 */
export function normalizeRepo(input: string): string | null {
  const trimmed = input
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/\/+$/, "");
  return REPO_PATTERN.test(trimmed) ? trimmed : null;
}

/**
 * Nur .json-Dateien, nur innerhalb des Repositorys.
 *
 * Der Pfad kommt aus einem Formular. Ohne diese Grenze liesse sich damit
 * jede beliebige Datei im Kundenrepo überschreiben, auch Code, der beim
 * nächsten Bauen ausgeführt wird.
 */
export function normalizeContentPath(input: string): string | null {
  const trimmed = input.trim().replace(/^\/+/, "");
  if (!/^[A-Za-z0-9._/-]+\.json$/.test(trimmed)) return null;
  if (trimmed.split("/").some((part) => part === "" || part === "." || part === "..")) {
    return null;
  }
  return trimmed;
}

export type PublishFailure =
  | "nicht-konfiguriert"
  | "ungueltig"
  | "zugang"
  | "nicht-gefunden"
  | "konflikt"
  | "fehler";

export type PublishResult =
  | { ok: true; changed: boolean }
  | { ok: false; reason: PublishFailure; detail?: string };

function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function github(path: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${apiBase}${path}`, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "D-Insight",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

function failureFor(status: number): PublishFailure {
  if (status === 401 || status === 403) return "zugang";
  // GitHub antwortet auf private Repositorys ohne Zugriff mit 404, nicht mit
  // 403. "Nicht gefunden" heisst hier also auch "Token darf nicht rein".
  if (status === 404) return "nicht-gefunden";
  if (status === 409 || status === 422) return "konflikt";
  return "fehler";
}

type CurrentFile =
  | { exists: true; sha: string; data: Record<string, unknown> }
  | { exists: false };

async function readCurrent(
  repo: string,
  path: string,
): Promise<CurrentFile | { error: PublishResult }> {
  const response = await github(`/repos/${repo}/contents/${encodePath(path)}`);

  if (response.status === 404) {
    // Datei fehlt oder Repository fehlt. Nur im zweiten Fall ist es ein
    // Fehler; eine fehlende Datei legen wir beim ersten Speichern an.
    const repoResponse = await github(`/repos/${repo}`);
    if (repoResponse.ok) return { exists: false };
    return { error: { ok: false, reason: failureFor(repoResponse.status) } };
  }

  if (!response.ok) {
    return { error: { ok: false, reason: failureFor(response.status) } };
  }

  const file = (await response.json()) as {
    type?: string;
    sha?: string;
    encoding?: string;
    content?: string;
  };

  if (file.type !== "file" || !file.sha || file.encoding !== "base64") {
    return {
      error: { ok: false, reason: "ungueltig", detail: "Pfad ist keine lesbare Datei" },
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(file.content ?? "", "base64").toString("utf8"));
  } catch {
    parsed = null;
  }

  // Eine Datei, die kein JSON-Objekt ist, wird nicht überschrieben. Steht
  // unter dem eingetragenen Pfad etwas anderes, ist der Pfad falsch, und
  // Überschreiben würde genau das zerstören.
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      error: { ok: false, reason: "ungueltig", detail: "Datei ist kein JSON-Objekt" },
    };
  }

  return { exists: true, sha: file.sha, data: parsed as Record<string, unknown> };
}

export async function publishContent(
  repoInput: string,
  pathInput: string,
  content: Record<string, string>,
): Promise<PublishResult> {
  if (!isGithubPublishConfigured) return { ok: false, reason: "nicht-konfiguriert" };

  const repo = normalizeRepo(repoInput);
  const path = normalizeContentPath(pathInput);
  if (!repo || !path) return { ok: false, reason: "ungueltig" };

  try {
    // Zwei Versuche: schreibt jemand zwischen Lesen und Schreiben in dieselbe
    // Datei, lehnt GitHub mit einem veralteten sha ab. Dann einmal frisch
    // lesen und erneut schreiben, statt dem Kunden einen Fehler zu zeigen.
    for (let attempt = 0; attempt < 2; attempt++) {
      const current = await readCurrent(repo, path);
      if ("error" in current) return current.error;

      const existing = current.exists ? current.data : {};

      // Zusammenführen statt ersetzen. Die Datei darf Werte enthalten, die im
      // Dashboard nicht als Feld freigegeben sind, etwa etwas, das wir von
      // Hand gepflegt haben. Die bleiben unangetastet.
      const merged = { ...existing, ...content };

      // Nichts geändert heisst: kein Commit. Jeder Commit löst einen Neubau
      // aus, und ein Kunde, der ohne Änderung auf Speichern drückt, soll
      // keine Bauminuten verbrauchen.
      if (current.exists && JSON.stringify(merged) === JSON.stringify(existing)) {
        return { ok: true, changed: false };
      }

      const body = JSON.stringify({
        message: "Inhalte aktualisiert über D-Insight",
        content: Buffer.from(`${JSON.stringify(merged, null, 2)}\n`, "utf8").toString(
          "base64",
        ),
        ...(current.exists ? { sha: current.sha } : {}),
        committer: { name: "D-Insight", email: "info@d-insight.ch" },
      });

      const response = await github(`/repos/${repo}/contents/${encodePath(path)}`, {
        method: "PUT",
        body,
      });

      if (response.ok) return { ok: true, changed: true };

      const reason = failureFor(response.status);
      if (reason === "konflikt" && attempt === 0) continue;
      return { ok: false, reason };
    }

    return { ok: false, reason: "konflikt" };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { ok: false, reason: "fehler", detail: aborted ? "Zeitüberschreitung" : undefined };
  }
}
