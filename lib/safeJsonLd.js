// Serializes an object for embedding inside a <script type="application/ld+json"> tag safely.
// JSON.stringify alone does not escape "<", so a value containing "</script>" could break out
// of the script context. Escaping "<" as a unicode sequence closes that gap.
export function safeJsonLd(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}
