# Estrutura de testes — gitprofile

Gerado em 2026-10-20. Estrutura montada; conteúdo dos testes ainda pendente (o usuário assumiu a escrita).

## Convenções

- `.spec.*` = testes isolados (unitários) → `tests/unit/`
- `.test.*` = testes com contexto real (store, hook, API, rotas) → `tests/integration/`
- `tests/mocks/` = stubs e fixtures compartilhados

## Pastas

```
tests/
├── unit/
│   ├── components/      # 3 arquivos: Button, IconButton, Modal
│   ├── utils/           # stackComparison
│   └── validations/     # userSchema
├── integration/
│   ├── components/     # 10 arquivos (Header, ProfileCard, etc.)
│   ├── hooks/          # 5 arquivos (useAuthListener, useGithubRepos, etc.)
│   ├── pages/          # 9 arquivos (Home, Profile, CandidatesDashboard, Login, etc.)
│   ├── routes/         # 2 arquivos (RootLayout, error-handling)
│   ├── store/          # 7 arquivos (useAuthStore, useCandidateStore, etc.)
│   ├── flows/          # 2 arquivos (search-to-profile, auth-to-complete)
│   └── fixtures/        # (se precisar de dados estáticos adicionais)
├── mocks/
│   ├── fixtures/        # .gitkeep
│   ├── handlers.ts      # MSW — vazio (a ser preenchido)
│   └── supabaseStub.ts  # Stub controlado — vazio (a ser preenchido)
```

## Mock Supabase (snippet para `tests/mocks/supabaseStub.ts`)

```ts
export const createSupabaseStub = () => ({
  auth: {
    getSession: async () => ({ data: { session: null } }),
    signOut: async () => ({ data: null, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
  from: (table) => ({
    select: () => ({
      eq: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        delete: () => ({ data: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        upsert: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  }),
});
```

## Vitest

`vitest.config.ts` foi editado para incluir `tests/`:

```ts
include: ["src/**/*.{spec,test}.{ts,tsx}", "tests/**/*.{spec,test}.{ts,tsx}"],
```

## Próximos passos (a ser feito pelo usuário)

1. Preencher `tests/mocks/supabaseStub.ts` com o snippet acima.
2. Escrever `tests/unit/store/useAuthStore.test.ts` (usando `vi.mock('@/lib/supabase')`).
3. Preencher os 3 `.spec` de `tests/unit/components/` (Button, IconButton, Modal).
4. Preencher os 10 `.test` de `tests/integration/components/`.
5. Preencher os 7 `.test` de `tests/integration/store/`.
6. Remover duplicata `src/components/ui/IconButton.test.tsx` (se não for mais usado).
