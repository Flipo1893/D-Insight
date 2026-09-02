#!/usr/bin/env node
/**
 * Measures what the home page actually costs a visitor, from the build
 * output.
 *
 * The site sells speed, so it quotes its own numbers. Those numbers were
 * typed in by hand, which means the first feature that adds a dependency
 * makes them quietly wrong, and nobody notices. This reads the prerendered
 * HTML, follows every asset it references, compresses each the way a host
 * would, and reports the total.
 *
 *   node scripts/measure.mjs           show the current numbers
 *   node scripts/measure.mjs --write   update app/lib/measured.json
 *   node scripts/measure.mjs --check   fail if the committed numbers drifted
 *
 * --check is the point of the exercise: run it in CI and stale numbers stop
 * the build instead of sitting on the page for months.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { brotliCompressSync, constants } from "node:zlib";
import { join } from "node:path";

const ROOT = process.cwd();
const HTML = join(ROOT, ".next/server/app/index.html");
const TARGET = join(ROOT, "app/lib/measured.json");

/** How far the numbers may drift before --check complains, in percent. */
const TOLERANCE = 10;

if (!existsSync(HTML)) {
  console.error(
    "Kein vorgerendertes HTML gefunden. Zuerst `npm run build` ausführen.",
  );
  process.exit(1);
}

/** Brotli at max quality, which is what a CDN serves for text assets. */
const compressed = (buffer) =>
  brotliCompressSync(buffer, {
    params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
  }).length;

const html = readFileSync(HTML);
const htmlBytes = compressed(html);

// Every /_next/static reference the page makes. Deduplicated, because the
// same chunk is often both preloaded and requested.
const referenced = [
  ...new Set(
    // Backslash excluded from the path: the same asset also appears inside
    // escaped JSON in the payload, as ...woff2\" — without this the trailing
    // backslash makes it a second, distinct entry and every font is counted
    // twice. That inflated the published figure by 52 KB and two requests.
    [...html.toString().matchAll(/["'](\/_next\/static\/[^"'\\]+)["']/g)].map(
      (match) => match[1].replace(/&amp;/g, "&"),
    ),
  ),
];

let assetBytes = 0;
const missing = [];

for (const url of referenced) {
  const file = join(ROOT, ".next", url.replace("/_next/", ""));
  if (!existsSync(file)) {
    missing.push(url);
    continue;
  }
  assetBytes += compressed(readFileSync(file));
}

const kb = (bytes) => Math.round(bytes / 1024);

const result = {
  // ISO date, taken from the build rather than typed in.
  date: new Date().toISOString().slice(0, 10),
  htmlKb: kb(htmlBytes),
  totalKb: kb(htmlBytes + assetBytes),
  requests: referenced.length + 1,
};

if (missing.length > 0) {
  console.warn(
    `${missing.length} referenzierte Datei(en) nicht im Build gefunden, nicht mitgezählt.`,
  );
}

const args = new Set(process.argv.slice(2));

if (args.has("--write")) {
  writeFileSync(TARGET, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Geschrieben: ${TARGET}`);
}

if (args.has("--check")) {
  if (!existsSync(TARGET)) {
    console.error("app/lib/measured.json fehlt. `npm run measure` ausführen.");
    process.exit(1);
  }
  const committed = JSON.parse(readFileSync(TARGET, "utf8"));
  const drift = (a, b) => (b === 0 ? 0 : Math.abs((a - b) / b) * 100);

  const problems = [];
  for (const key of ["totalKb", "requests"]) {
    const percent = drift(result[key], committed[key]);
    if (percent > TOLERANCE) {
      problems.push(
        `${key}: auf der Seite steht ${committed[key]}, gemessen ${result[key]} (${percent.toFixed(0)}% Abweichung)`,
      );
    }
  }

  if (problems.length > 0) {
    console.error("Die veröffentlichten Messwerte stimmen nicht mehr:");
    for (const problem of problems) console.error(`  ${problem}`);
    console.error("\n`npm run measure` ausführen und das Ergebnis committen.");
    process.exit(1);
  }
  console.log("Messwerte sind aktuell.");
}

console.log(
  `HTML ${result.htmlKb} KB · gesamt ${result.totalKb} KB · ${result.requests} Anfragen · ${result.date}`,
);
