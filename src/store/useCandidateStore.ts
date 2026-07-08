import { create } from 'zustand'
import type { Candidate, CandidateStoreState, Job } from '../types/github'
import { createJSONStorage, persist } from 'zustand/middleware'

/**
 * Store global de Triagem e Vagas utilizando Zustand.
 * Utiliza o middleware 'persist' para salvar o estado automaticamente no localStorage do navegador,
 * servindo como um "banco de dados local" leve enquanto não integramos o Supabase.
 */
export const useCandidateStore = create<CandidateStoreState>()(
	persist(
		(set, get) => ({
			jobs: [],
			candidates: [],

			// Adiciona uma nova vaga na lista
			addJob: (job: Job) =>
				set((state) => {
					return {
						jobs: [...state.jobs, job],
					}
				}),

			// Atualiza campos específicos de uma vaga pelo ID (ex: lista de requisitos)
			updateJob: (id: string, updatedFields: Partial<Job>) =>
				set((state) => ({
					jobs: state.jobs.map((j) =>
						j.id === id ? { ...j, ...updatedFields } : j,
					),
				})),

			// Remove uma vaga pelo ID
			removeJob: (id: string) =>
				set((state) => {
					return {
						jobs: state.jobs.filter((j) => j.id !== id),
					}
				}),

			// Salva ou Atualiza um candidato (comportamento de UPSERT)
			addCandidate: (candidate: Candidate) => {
				const currentCandidates = get().candidates

				// Verifica se o candidato já existe pelo username do GitHub (login)
				const candidateExists = currentCandidates.some(
					(c) => c.login === candidate.login,
				)

				if (candidateExists) {
					// Se existe, substitui o registro antigo pelos novos dados atualizados
					const updateList = currentCandidates.map((c) =>
						c.login === candidate.login ? candidate : c,
					)
					set({ candidates: updateList })
				} else {
					// Se não existe, insere o novo candidato no final da lista
					set({ candidates: [...currentCandidates, candidate] })
				}
			},

			// Remove um candidato pelo username (login)
			removeCandidate: (login: string) =>
				set((state) => {
					return {
						candidates: state.candidates.filter((c) => c.login !== login),
					}
				}),

			// Atualiza apenas o status de triagem do candidato
			updateCandidateStatus: (login: string, status: Candidate['status']) => {
				const { candidates } = get()
				const updatedCandidates = candidates.map((c) =>
					c.login === login
						? { ...c, status, notes: c.notes || 'Sem anotações.' }
						: c,
				)
				set({ candidates: updatedCandidates })
			},

			// Atualiza a avaliação de um requisito específico de uma vaga para o candidato (triagem em tempo real)
			evaluateRequirement: (
				candidateLogin: string,
				requirementKey: string,
				value: boolean,
			) => {
				const { candidates } = get()
				const updatedCandidates = candidates.map((c) =>
					c.login === candidateLogin
						? {
								...c,
								// Faz merge do requisito alterado sem perder as avaliações de outros requisitos
								requirementsEvaluation: {
									...c.requirementsEvaluation,
									[requirementKey]: value,
								},
							}
						: c,
				)
				set({ candidates: updatedCandidates })
			},
		}),
		{
			// Configuração do nome da chave persistida no localStorage
			name: 'candidate-store',
			storage: createJSONStorage(() => localStorage),
		},
	),
)
