import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useRepoFileContent } from '../../../src/hooks/useRepoFileContent';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useRepoFileContent', () => {
  it('renders without crashing when disabled', () => {
    const { result } = renderHook(() => useRepoFileContent({ owner: 'o', repo: 'r', path: null, enabled: false }), { wrapper });
    expect(result.current).toBeDefined();
  });
});