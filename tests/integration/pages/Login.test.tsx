import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Login from "@/pages/Login";
import { MemoryRouter } from "react-router-dom";
import React from "react";

vi.mock('@/assets/logo.svg?react', () => ({
  default: () => React.createElement('div', { 'data-testid': 'logo-mock' }),
}));

describe("Login Page", () => {
  it("renders login title", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getAllByText(/GitProfile/i)[0]).toBeInTheDocument();
  });
});
