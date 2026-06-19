import * as z from 'zod'

export const userSchema = z.object({
  username: z.string()
  .min(1, 'O username do usuário deve ter pelo menos 1 caracter')
  .max(39, 'O username do usuário deve ter no máximo 39 caracteres')
  .regex(/^[a-zA-Z0-9-]+$/, 'O username deve conter apenas letras, números e hífens')
})

export type UsernameInput = z.infer<typeof userSchema>