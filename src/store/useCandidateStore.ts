import { create } from 'zustand'
import type { Candidate, CandidateStoreState, Job } from '../types/github'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useCandidateStore = create<CandidateStoreState>()(
	persist(
		(set, get) => ({
			jobs: [],
			candidates: [],

			addJob: (job: Job) =>
				set((state) => {
					return {
						jobs: [...state.jobs, job],
					}
				}),
			removeJob: (id: string) =>
				set((state) => {
					return {
						jobs: state.jobs.filter((j) => j.id !== id),
					}
				}),

			addCandidate: (candidate: Candidate) => {
				const currentCandidates = get().candidates

				const candidateExists = currentCandidates.some(
					(c) => c.login === candidate.login,
				)

				if (candidateExists) {
					const updateList = currentCandidates.map((c) =>
						c.login === candidate.login ? candidate : c,
					)
					set({ candidates: updateList })
				} else {
					set({ candidates: [...currentCandidates, candidate] })
				}
			},
			removeCandidate: (login: string) =>
				set((state) => {
					return {
						candidates: state.candidates.filter((c) => c.login !== login),
					}
				}),

			updateCandidateStatus: (login: string, status: Candidate['status']) => {
				const { candidates } = get()
				const updatedCandidates = candidates.map((c) =>
					c.login === login
						? { ...c, status, notes: c.notes || 'Sem anotações.' }
						: c,
				)
				set({ candidates: updatedCandidates })
			},
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
			name: 'candidate-store',
			storage: createJSONStorage(() => localStorage),
		},
	),
)
