import * as z from 'zod'

// Esquema de validação Zod para o campo username de buscas do GitHub
// Garante conformidade com o formato oficial do GitHub (apenas alfanuméricos e hífens, min 1 e max 39)
export const userSchema = z.object({
	username: z
		.string()
		.min(1, 'O username do usuário deve ter pelo menos 1 caractere')
		.max(39, 'O username do usuário deve ter no máximo 39 caracteres')
		.regex(
			/^[a-zA-Z0-9-]+$/,
			'O username deve conter apenas letras, números e hífens',
		),
})

export type UsernameInput = z.infer<typeof userSchema>
