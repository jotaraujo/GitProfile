import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "@/pages/Home";
import { MemoryRouter } from "react-router-dom";
import React from "react";

vi.mock('@/assets/logo.svg?react', () => ({
  default: () => React.createElement('div', { 'data-testid': 'logo-mock' }),
}));

describe("Home Page", () => {
  it("renders search console", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByPlaceholderText(/Digite o usuário/i)).toBeInTheDocument();
  });
});
