export interface LanguageStat {
	name: string
	percentage: number
	color: string
}

export interface ComparisonResult {
	commonLanguages: string[]
	affinityPercentage: number
	summaryText: string
}

export const compareStacks = (
	myStats: LanguageStat[],
	targetStats: LanguageStat[],
	targetUsername: string,
): ComparisonResult => {
	let affinityPercentage = 0

	let summaryText = ''

	const commonLanguages = myStats
		.filter((myLang) => {
			if (myLang.name === 'Outras') return false

			return targetStats.some((targetLang) => targetLang.name === myLang.name)
		})
		.map((lang) => lang.name)

	for (const myLang of myStats) {
		if (myLang.name === 'Outras') continue

		// Procura se o outro dev também usa essa mesma linguagem
		const targetLang = targetStats.find((lang) => lang.name === myLang.name)

		if (targetLang) {
			// Soma a menor porcentagem entre os dois
			affinityPercentage += Math.min(myLang.percentage, targetLang.percentage)
		}
	}

	const finalAffinity = Math.min(100, Math.round(affinityPercentage))

	if (commonLanguages.length === 0) {
		summaryText = `Vocês possuem stacks completamente distintas. Ótima oportunidade para explorar novas tecnologias com @${targetUsername}`
	} else if (finalAffinity >= 70) {
		summaryText = `Alta afinidade técnica! Você e @${targetUsername} possuem forte convergência em ${commonLanguages.join(', ')}.`
	} else if (finalAffinity >= 30) {
		summaryText = `Afinidade moderada. Vocês compartilham experiência em ${commonLanguages.join(', ')}.`
	} else {
		summaryText = `Pouca sobreposição direta de stacks, mas vocês tem em comum: ${commonLanguages.join(', ')}.`
	}

	return {
		commonLanguages: commonLanguages,
		affinityPercentage: finalAffinity,
		summaryText,
	}
}
