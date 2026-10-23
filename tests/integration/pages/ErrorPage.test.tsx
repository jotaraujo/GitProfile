import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ErrorPage from "@/pages/ErrorPage";
import { MemoryRouter } from "react-router-dom";

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom") as any),
  useRouteError: () => ({ status: 404 }),
  isRouteErrorResponse: () => true,
}));

describe("ErrorPage Page", () => {
  it("renders 404 message", () => {
    render(<MemoryRouter><ErrorPage /></MemoryRouter>);
    expect(screen.getByText(/Página não encontrada/i)).toBeInTheDocument();
  });
});
