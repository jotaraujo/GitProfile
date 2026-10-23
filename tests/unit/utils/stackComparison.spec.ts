import { describe, it, expect } from 'vitest'
import { compareStacks } from '../../../src/utils/stackComparison'
import type { LanguageStat } from '../../../src/utils/stackComparison'

const makeStats = (entries: Array<[string, number]>): LanguageStat[] =>
	entries.map(([name, percentage]) => ({ name, percentage, color: '#8b949e' }))

describe('compareStacks', () => {
	it('returns zero affinity when there are no common languages', () => {
		const myStats = makeStats([['JavaScript', 60], ['TypeScript', 40]])
		const targetStats = makeStats([['Python', 100]])
		const result = compareStacks(myStats, targetStats, 'target')
		expect(result.affinityPercentage).toBe(0)
		expect(result.commonLanguages).toEqual([])
	})

	it('calculates affinity percentage based on minimum of shared languages', () => {
		const myStats = makeStats([['JavaScript', 50], ['TypeScript', 50]])
		const targetStats = makeStats([['JavaScript', 30], ['TypeScript', 20]])
		const result = compareStacks(myStats, targetStats, 'target')
		expect(result.affinityPercentage).toBe(50)
		expect(result.commonLanguages).toEqual(['JavaScript', 'TypeScript'])
	})

	it('returns high affinity summary when affinity >= 70', () => {
		const myStats = makeStats([['JavaScript', 50], ['TypeScript', 50]])
		const targetStats = makeStats([['JavaScript', 50], ['TypeScript', 50]])
		const result = compareStacks(myStats, targetStats, 'target')
		expect(result.affinityPercentage).toBe(100)
		expect(result.summaryText).toContain('Alta afinidade')
	})

	it('returns moderate affinity summary when affinity >= 30 and < 70', () => {
		const myStats = makeStats([['JavaScript', 50], ['TypeScript', 50]])
		const targetStats = makeStats([['JavaScript', 30]])
		const result = compareStacks(myStats, targetStats, 'target')
		expect(result.affinityPercentage).toBe(30)
		expect(result.summaryText).toContain('Afinidade moderada')
	})

	it('returns low affinity summary when affinity < 30 but there are common languages', () => {
		const myStats = makeStats([['JavaScript', 50], ['TypeScript', 50]])
		const targetStats = makeStats([['JavaScript', 10]])
		const result = compareStacks(myStats, targetStats, 'target')
		expect(result.affinityPercentage).toBe(10)
		expect(result.summaryText).toContain('Pouca sobreposição')
	})

	it('ignores Outras category in common languages calculation', () => {
		const myStats = makeStats([['Outras', 10], ['JavaScript', 90]])
		const targetStats = makeStats([['Outras', 100]])
		const result = compareStacks(myStats, targetStats, 'target')
		expect(result.commonLanguages).toEqual([])
		expect(result.affinityPercentage).toBe(0)
	})

	it('caps affinity at 100 percent', () => {
		const myStats = makeStats([['JavaScript', 100]])
		const targetStats = makeStats([['JavaScript', 100]])
		const result = compareStacks(myStats, targetStats, 'target')
		expect(result.affinityPercentage).toBe(100)
	})

	it('handles empty target stats', () => {
		const myStats = makeStats([['JavaScript', 50], ['TypeScript', 50]])
		const targetStats: LanguageStat[] = []
		const result = compareStacks(myStats, targetStats, 'target')
		expect(result.affinityPercentage).toBe(0)
		expect(result.commonLanguages).toEqual([])
	})

	it('handles empty my stats', () => {
		const myStats: LanguageStat[] = []
		const targetStats = makeStats([['JavaScript', 100]])
		const result = compareStacks(myStats, targetStats, 'target')
		expect(result.affinityPercentage).toBe(0)
		expect(result.commonLanguages).toEqual([])
	})

	it('returns correct object shape', () => {
		const myStats = makeStats([['JavaScript', 50]])
		const targetStats = makeStats([['JavaScript', 50]])
		const result = compareStacks(myStats, targetStats, 'target')
		expect(result).toHaveProperty('commonLanguages')
		expect(result).toHaveProperty('affinityPercentage')
		expect(result).toHaveProperty('summaryText')
		expect(Array.isArray(result.commonLanguages)).toBe(true)
		expect(typeof result.affinityPercentage).toBe('number')
		expect(typeof result.summaryText).toBe('string')
	})
})