const getsSchema = require('../data/gets_schema.json');

function normalize(name) {
  return name.toLowerCase().replace(/[_\s]+/g, '').trim();
}

function getType(value) {
  if (!value) return 'empty';
  if (!isNaN(Date.parse(value))) return 'date';
  if (!isNaN(Number(value))) return 'number';
  return 'text';
}

function matchFields(rows) {
  const inputKeys = Object.keys(rows[0] || {});
  const normalizedInput = inputKeys.map(k => ({
    original: k,
    normalized: normalize(k)
  }));

  const getsKeys = Object.values(getsSchema).flat(); // Flattened list of all keys
  const matched = [];
  const close = [];
  const missing = [];

  for (const targetKey of getsKeys) {
    const normTarget = normalize(targetKey);

    const exactMatch = normalizedInput.find(k => k.normalized === normTarget);
    if (exactMatch) {
      matched.push(targetKey);
    } else {
      const candidate = normalizedInput.find(k =>
        k.normalized.includes(normTarget) ||
        normTarget.includes(k.normalized)
      );
      if (candidate) {
        close.push({
          target: targetKey,
          candidate: candidate.original,
          confidence: 0.8 // Static confidence for now
        });
      } else {
        missing.push(targetKey);
      }
    }
  }

  return {
    coverage: {
      matched,
      close,
      missing
    },
    inputKeys
  };
}

module.exports = matchFields;
