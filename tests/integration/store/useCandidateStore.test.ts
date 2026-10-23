import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCandidateStore } from '../../../src/store/useCandidateStore'
import type { Candidate, Job } from '../../../src/types/github'

const mockJob = (overrides: Partial<Job> = {}): Job => ({
  id: 'job-1',
  title: 'Frontend Developer',
  requirements: ['React', 'TypeScript'],
  createdAt: Date.now(),
  ...overrides,
})

const mockCandidate = (overrides: Partial<Candidate> = {}): Candidate => ({
  login: 'octocat',
  name: 'The Octocat',
  avatar_url: 'https://github.com/octocat.png',
  bio: 'GitHub mascot',
  html_url: 'https://github.com/octocat',
  jobRole: 'Frontend Developer',
  contactUrl: 'https://linkedin.com/in/octocat',
  notes: 'Great candidate',
  status: 'pendente',
  requirementsEvaluation: {},
  savedAt: Date.now(),
  ...overrides,
})

describe('useCandidateStore', () => {
  beforeEach(() => {
    useCandidateStore.setState({ jobs: [], candidates: [] })
  })

  it('should add a job', () => {
    const job = mockJob()
    useCandidateStore.getState().addJob(job)

    const state = useCandidateStore.getState()
    expect(state.jobs).toEqual([job])
  })

  it('should add multiple jobs', () => {
    const job1 = mockJob({ id: 'job-1' })
    const job2 = mockJob({ id: 'job-2' })

    useCandidateStore.getState().addJob(job1)
    useCandidateStore.getState().addJob(job2)

    const state = useCandidateStore.getState()
    expect(state.jobs).toEqual([job1, job2])
  })

  it('should update a job', () => {
    const job = mockJob()
    useCandidateStore.getState().addJob(job)

    useCandidateStore.getState().updateJob('job-1', { title: 'Backend Developer' })

    const state = useCandidateStore.getState()
    expect(state.jobs[0].title).toBe('Backend Developer')
    expect(state.jobs[0].requirements).toEqual(['React', 'TypeScript'])
  })

  it('should update job requirements', () => {
    const job = mockJob()
    useCandidateStore.getState().addJob(job)

    useCandidateStore.getState().updateJob('job-1', { requirements: ['React', 'Vue', 'CSS'] })

    const state = useCandidateStore.getState()
    expect(state.jobs[0].requirements).toEqual(['React', 'Vue', 'CSS'])
  })

  it('should remove a job', () => {
    const job = mockJob()
    useCandidateStore.getState().addJob(job)

    useCandidateStore.getState().removeJob('job-1')

    const state = useCandidateStore.getState()
    expect(state.jobs).toEqual([])
  })

  it('should not remove a non-existent job', () => {
    const job = mockJob()
    useCandidateStore.getState().addJob(job)

    useCandidateStore.getState().removeJob('non-existent')

    const state = useCandidateStore.getState()
    expect(state.jobs).toEqual([job])
  })

  it('should add a new candidate', () => {
    const candidate = mockCandidate()
    useCandidateStore.getState().addCandidate(candidate)

    const state = useCandidateStore.getState()
    expect(state.candidates).toEqual([candidate])
  });

  it('should update existing candidate when login matches', () => {
    const candidate1 = mockCandidate({ login: 'octocat', name: 'Old Name' })
    const candidate2 = mockCandidate({ login: 'octocat', name: 'New Name' })

    useCandidateStore.getState().addCandidate(candidate1)
    useCandidateStore.getState().addCandidate(candidate2)

    const state = useCandidateStore.getState()
    expect(state.candidates).toHaveLength(1)
    expect(state.candidates[0].name).toBe('New Name')
  })

  it('should remove a candidate by login', () => {
    const candidate = mockCandidate()
    useCandidateStore.getState().addCandidate(candidate)

    useCandidateStore.getState().removeCandidate('octocat')

    const state = useCandidateStore.getState()
    expect(state.candidates).toEqual([])
  })

  it('should update candidate status', () => {
    const candidate = mockCandidate({ status: 'pendente' })
    useCandidateStore.getState().addCandidate(candidate)

    useCandidateStore.getState().updateCandidateStatus('octocat', 'triagem')

    const state = useCandidateStore.getState()
    expect(state.candidates[0].status).toBe('triagem')
  })

  it('should add notes when updating candidate status', () => {
    const candidate = mockCandidate({ status: 'pendente', notes: '' })
    useCandidateStore.getState().addCandidate(candidate)

    useCandidateStore.getState().updateCandidateStatus('octocat', 'aprovado')

    const state = useCandidateStore.getState()
    expect(state.candidates[0].notes).toBe('Sem anotações.')
  })

  it('should evaluate requirement for existing candidate', () => {
    const candidate = mockCandidate({ requirementsEvaluation: {} })
    useCandidateStore.getState().addCandidate(candidate)

    useCandidateStore.getState().evaluateRequirement('octocat', 'React', true)

    const state = useCandidateStore.getState()
    expect(state.candidates[0].requirementsEvaluation).toEqual({ React: true })
  })

  it('should evaluate multiple requirements', () => {
    const candidate = mockCandidate({ requirementsEvaluation: {} })
    useCandidateStore.getState().addCandidate(candidate)

    useCandidateStore.getState().evaluateRequirement('octocat', 'React', true)
    useCandidateStore.getState().evaluateRequirement('octocat', 'TypeScript', false)

    const state = useCandidateStore.getState()
    expect(state.candidates[0].requirementsEvaluation).toEqual({
      React: true,
      TypeScript: false,
    })
  })

  it('should handle multiple candidates with different logins', () => {
    const candidate1 = mockCandidate({ login: 'octocat' })
    const candidate2 = mockCandidate({ login: 'torvalds' })

    useCandidateStore.getState().addCandidate(candidate1)
    useCandidateStore.getState().addCandidate(candidate2)

    const state = useCandidateStore.getState()
    expect(state.candidates).toHaveLength(2)
  })
})
