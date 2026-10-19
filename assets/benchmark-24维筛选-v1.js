// Consume generated evidence; never reclassify source prose in the browser.
export function dimensionMatches(record, dimension, evidence = "supported") {
  const matches = (record?.project_dimensions || [])
    .filter((match) => evidence === "all" || match.status === "supported");
  return dimension === "unmapped" ? !matches.length : matches.some((match) => match.id === dimension);
}

export function buildDimensionIndex(records) {
  const bySlug = new Map();
  const counts = new Map();
  let unmappedSupported = 0;
  let unmappedAll = 0;
  for (const record of records) {
    bySlug.set(record.slug, record);
    const matches = record.project_dimensions || [];
    if (!matches.length) unmappedAll++;
    if (!matches.some((match) => match.status === "supported")) unmappedSupported++;
    for (const match of matches) {
      const count = counts.get(match.id) || { supported: 0, candidate: 0, scored: 0 };
      count[match.status]++;
      if (match.status === "supported" && record.score_count > 0) count.scored++;
      counts.set(match.id, count);
    }
  }
  return { bySlug, counts, unmappedSupported, unmappedAll };
}
