import { describe, it, expect } from 'vitest'
import { userSchema } from '../../../src/validations/userSchema'

describe('userSchema', () => {
	it('accepts a valid username with only letters', () => {
		const result = userSchema.safeParse({ username: 'octocat' })
		expect(result.success).toBe(true)
	})

	it('accepts a valid username with numbers', () => {
		const result = userSchema.safeParse({ username: 'user123' })
		expect(result.success).toBe(true)
	})

	it('accepts a valid username with hyphens', () => {
		const result = userSchema.safeParse({ username: 'octo-cat' })
		expect(result.success).toBe(true)
	})

	it('accepts a valid username with mixed characters', () => {
		const result = userSchema.safeParse({ username: 'John-Doe123' })
		expect(result.success).toBe(true)
	})

	it('rejects an empty username', () => {
		const result = userSchema.safeParse({ username: '' })
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues[0].message).toContain('pelo menos 1 caractere')
		}
	})

	it('rejects a username that is too long (over 39 characters)', () => {
		const longUsername = 'a'.repeat(40)
		const result = userSchema.safeParse({ username: longUsername })
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues[0].message).toContain('no máximo 39')
		}
	})

	it('accepts a username with exactly 39 characters', () => {
		const username = 'a'.repeat(39)
		const result = userSchema.safeParse({ username })
		expect(result.success).toBe(true)
	})

	it('rejects a username with special characters', () => {
		const result = userSchema.safeParse({ username: 'octo@cat' })
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues[0].message).toContain('apenas letras, números e hífens')
		}
	})

	it('rejects a username with underscores', () => {
		const result = userSchema.safeParse({ username: 'octo_cat' })
		expect(result.success).toBe(false)
	})

	it('rejects a username with spaces', () => {
		const result = userSchema.safeParse({ username: 'octo cat' })
		expect(result.success).toBe(false)
	})

	it('rejects a username with dots', () => {
		const result = userSchema.safeParse({ username: 'octo.cat' })
		expect(result.success).toBe(false)
	})

	it('rejects a username with emoji', () => {
		const result = userSchema.safeParse({ username: 'octo😀' })
		expect(result.success).toBe(false)
	})

	it('rejects missing username field', () => {
		const result = userSchema.safeParse({})
		expect(result.success).toBe(false)
	})

	it('rejects non-string username', () => {
		const result = userSchema.safeParse({ username: 123 })
		expect(result.success).toBe(false)
	})

	it('accepts single character username', () => {
		const result = userSchema.safeParse({ username: 'a' })
		expect(result.success).toBe(true)
	})

	it('provides UsernameInput type', () => {
		// Type-level check: UsernameInput should be inferred from userSchema
		const result = userSchema.safeParse({ username: 'test' })
		expect(result.success).toBe(true)
		if (result.success) {
			const typed: { username: string } = result.data
			expect(typed.username).toBe('test')
		}
	})
})
