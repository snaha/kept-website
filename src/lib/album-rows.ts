/**
 * Returns a shuffled copy of `items` (Fisher-Yates), leaving the input as is.
 * `random` must return values in [0, 1) like `Math.random`, which it defaults to.
 */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Splits `items` into `rowCount` consecutive rows whose lengths differ by at
 * most one; any remainder goes to the first rows.
 */
export function splitIntoRows<T>(items: readonly T[], rowCount: number): T[][] {
  if (!Number.isInteger(rowCount) || rowCount < 1) {
    throw new RangeError(`rowCount must be a positive integer, got ${rowCount}`)
  }

  const baseLength = Math.floor(items.length / rowCount)
  const remainder = items.length % rowCount
  const rows: T[][] = []
  let start = 0
  for (let row = 0; row < rowCount; row++) {
    const length = baseLength + (row < remainder ? 1 : 0)
    rows.push(items.slice(start, start + length))
    start += length
  }
  return rows
}
