import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import History from "@/pages/History";
import { MemoryRouter } from "react-router-dom";

describe("History Page", () => {
  it("renders history title", () => {
    render(<MemoryRouter><History /></MemoryRouter>);
    expect(screen.getByText(/Histórico de Pesquisas/i)).toBeInTheDocument();
  });
});
