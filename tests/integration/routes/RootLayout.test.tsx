import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RootLayout from "@/components/layout/RootLayout";
import { MemoryRouter } from "react-router-dom";
import React from "react";

vi.mock('@/assets/logo.svg?react', () => ({
  default: () => React.createElement('div', { 'data-testid': 'logo-mock' }),
}));

describe("RootLayout", () => {
  it("renders header", () => {
    render(<MemoryRouter><RootLayout /></MemoryRouter>);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
