import { describe, expect, it } from 'vitest'

import { shuffle, splitIntoRows } from './album-rows'

/** Deterministic stand-in for Math.random that replays the given values. */
function sequence(...values: number[]): () => number {
  let index = 0
  return () => values[index++ % values.length]
}

describe('shuffle', () => {
  it('returns a permutation of the input without mutating it', () => {
    const input = ['a', 'b', 'c', 'd', 'e']
    const result = shuffle(input)

    expect(input).toEqual(['a', 'b', 'c', 'd', 'e'])
    expect([...result].sort()).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('swaps each position with one picked by the random source (Fisher-Yates)', () => {
    // i=3: j=floor(0*4)=0 → [d,b,c,a]; i=2: j=floor(0.5*3)=1 → [d,c,b,a]; i=1: j=floor(0.99*2)=1
    expect(shuffle(['a', 'b', 'c', 'd'], sequence(0, 0.5, 0.99))).toEqual(['d', 'c', 'b', 'a'])
  })

  it('keeps the order when the random source always picks the current position', () => {
    expect(shuffle(['a', 'b', 'c'], sequence(0.999))).toEqual(['a', 'b', 'c'])
  })

  it('handles empty and single-item input', () => {
    expect(shuffle([])).toEqual([])
    expect(shuffle(['a'])).toEqual(['a'])
  })
})

describe('splitIntoRows', () => {
  it('splits 60 covers into 5 rows of 12', () => {
    const items = Array.from({ length: 60 }, (_, i) => i)
    const rows = splitIntoRows(items, 5)

    expect(rows).toHaveLength(5)
    expect(rows.map((row) => row.length)).toEqual([12, 12, 12, 12, 12])
    expect(rows.flat()).toEqual(items)
  })

  it('spreads a remainder over the first rows so sizes differ by at most one', () => {
    const rows = splitIntoRows([1, 2, 3, 4, 5, 6, 7], 3)

    expect(rows).toEqual([
      [1, 2, 3],
      [4, 5],
      [6, 7],
    ])
  })

  it('returns empty rows when there are fewer items than rows', () => {
    expect(splitIntoRows([1], 3)).toEqual([[1], [], []])
  })

  it('rejects a non-positive row count', () => {
    expect(() => splitIntoRows([1, 2], 0)).toThrow()
  })
})
