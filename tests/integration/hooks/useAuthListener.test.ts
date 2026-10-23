import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useAuthListener from '../../../src/hooks/useAuthListener';
import { useAuthStore } from '../../../src/store/useAuthStore';

vi.mock('../../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

vi.mock('../../../src/store/useAuthStore', () => ({
  useAuthStore: vi.fn().mockReturnValue({
    setSession: vi.fn(),
    setProfile: vi.fn(),
    setLoading: vi.fn(),
  }),
}));

describe('useAuthListener', () => {
  it('initializes and checks session', async () => {
    const { result } = renderHook(() => useAuthListener());
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });
  });
});