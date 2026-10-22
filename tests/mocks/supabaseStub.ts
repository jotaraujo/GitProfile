import type { SupabaseTable } from "../../src/types/supabase";

const mockData: Record<SupabaseTable, Record<string, unknown>[]> = {
  user_profiles: [],
  followed_profiles: [],
  search_history: [],
  saved_profiles: [],
  saved_repositories: [],
  user_notifications: [],
  recruiter_notes: [],
};

const makeBuilder = (
  table: SupabaseTable,
  seed?: Partial<Record<SupabaseTable, Record<string, unknown>[]>>,
) => {
  let rows = [...(seed?.[table] ?? mockData[table])];

  const builder = {
    select: (cols?: string) => makeBuilder(table, seed),
    eq: (col: string, val: unknown) => {
      rows = rows.filter((r) => r[col] === val);
      return makeBuilder(table, seed);
    },
    order: (col: string, opts?: { ascending?: boolean }) => {
      rows.sort((a, b) => {
        const dir = opts?.ascending === false ? -1 : 1;
        return (a[col] ?? "") > (b[col] ?? "") ? dir : -dir;
      });
      return makeBuilder(table, seed);
    },
    single: async () => ({ data: rows[0] ?? null, error: null }),
    maybeSingle: async () => ({ data: rows[0] ?? null, error: null }),
    // Para delete/insert/upsert, você pode expandir conforme os testes que escrever
  };

  return new Proxy(builder as any, {
    get: (target, prop) => {
      if (prop === "then") return undefined;
      if (prop === "catch") return undefined;
      if (prop === "finally") return undefined;

      if (prop === "delete") {
        const deleteBuilder = {
          eq: (c: string, v: unknown) => {
            const remaining = rows.filter((r) => r[c] !== v); // simplificado
            return makeBuilder(table, seed);
          },
        };
        return () => deleteBuilder;
      }
      if (prop === "insert")
        return () => Promise.resolve({ data: null, error: null });
      if (prop === "upsert")
        return () => Promise.resolve({ data: null, error: null });

      return Reflect.get(target, prop as string);
    },
    apply: () => Promise.resolve({ data: rows, error: null }), // torna awaitável
  }) as any;
};

export const createSupabaseStub = (
  seed?: Partial<Record<SupabaseTable, Record<string, unknown>[]>>,
) => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ data: null, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
      error: null,
    }),
  },
  from: (table: SupabaseTable) => makeBuilder(table, seed),
});
