import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useRepoContents } from '../../../src/hooks/useRepoContents';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useRepoContents', () => {
  it('renders without crashing when closed', () => {
    const { result } = renderHook(() => useRepoContents({ owner: 'o', repo: 'r', isOpen: false }), { wrapper });
    expect(result.current).toBeDefined();
  });
});