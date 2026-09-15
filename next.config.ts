import type { NextConfig } from "next";

/**
 * Sicherheits-Header.
 *
 * Bewusst hier und nicht in einem Proxy: Die Variante mit Nonce, die Next
 * empfiehlt, verlangt, dass jede Seite bei jedem Aufruf neu gerendert wird.
 * Das kostet auf einer Verkaufsseite, die bisher fast vollstaendig statisch
 * ausgeliefert wird, genau die Ladezeit, mit der wir werben. Der Preis
 * dafuer steht unten bei script-src.
 */
const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",

  // 'unsafe-inline' ist die Schwachstelle dieser Fassung und keine
  // Nachlaessigkeit: Next legt seine Start-Skripte inline in die Seite, und
  // ohne Nonce — siehe oben — gibt es keinen Weg, genau die zu erlauben und
  // fremde zu verbieten. Was bleibt, ist trotzdem viel wert: ein
  // eingeschleustes <script src="..."> von einer fremden Domain laedt nicht.
  // 'unsafe-eval' nur in der Entwicklung, dort braucht React es fuer
  // lesbare Fehlermeldungen.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://www.googletagmanager.com`,

  // Tailwind und React setzen Stile inline; ohne Nonce gilt hier dasselbe.
  "style-src 'self' 'unsafe-inline'",

  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data:",

  // Wohin die Seite selbst Daten schickt: Formspree nimmt die Anfragen aus
  // dem Kontaktformular entgegen, der Rest ist Messung.
  "connect-src 'self' https://formspree.io https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",

  // Nichts davon braucht die Seite, also gibt es auch keinen Weg hinein.
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  // Das Formular postet zu Formspree, deshalb steht das hier und nicht nur
  // 'self'.
  "form-action 'self' https://formspree.io",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },

  // frame-ancestors oben deckt dasselbe ab und ist die modernere Regel;
  // dieser Header bleibt fuer aeltere Browser, die sie nicht kennen.
  { key: "X-Frame-Options", value: "DENY" },

  // Verhindert, dass ein Browser eine hochgeladene Datei als etwas anderes
  // behandelt, als der Content-Type sagt — der Klassiker, mit dem aus einem
  // vermeintlichen Bild ein Skript wird.
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Fremde Seiten erfahren nur, dass jemand von d-insight.ch kam, nicht von
  // welcher Unterseite. Innerhalb der eigenen Seite bleibt der volle Pfad.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Nichts davon braucht die Seite. Eine leere Liste heisst: auch nicht fuer
  // eingebettete Inhalte.
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    /*
     * Next 16 only serves qualities listed here and silently falls back to 75
     * for anything else. The portraits ask for 85 to stay sharp at the size
     * they are actually rendered at, so 85 has to be declared or that request
     * is dropped without a word.
     */
    qualities: [75, 85],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
