import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Saved from "@/pages/Saved";
import { MemoryRouter } from "react-router-dom";

describe("Saved Page", () => {
  it("renders favorites title", () => {
    render(<MemoryRouter><Saved /></MemoryRouter>);
    expect(screen.getByText(/Meus Favoritos/i)).toBeInTheDocument();
  });
});
