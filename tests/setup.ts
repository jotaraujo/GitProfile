import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import React from 'react'

vi.mock('*.svg', () => ({
  default: 'mocked-svg',
}));

vi.mock('*.svg?react', () => ({
  default: () => React.createElement('div', { 'data-testid': 'logo-mock' }),
}));

vi.stubGlobal('URL', {
  createObjectURL: vi.fn(),
  revokeObjectURL: vi.fn(),
});

class MockImage extends Image {
  src = '';
  onload = null;
  onerror = null;
  render() {}
}
(globalThis as any).Image = MockImage;
