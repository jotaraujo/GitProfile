import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import EngagementSummaryCard from "@/components/profile/EngagementSummaryCard";

describe("EngagementSummaryCard", () => {
  it("renders engagement summary title", () => {
    render(<EngagementSummaryCard stars={10} forks={5} repoCount={2} />);
    expect(screen.getByText(/Resumo de Engajamento/i)).toBeInTheDocument();
  });
});
