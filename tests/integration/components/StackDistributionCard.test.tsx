import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import StackDistributionCard from "@/components/profile/StackDistributionCard";

describe("StackDistributionCard", () => {
  it("renders stack distribution title", () => {
    render(
      <StackDistributionCard
        languageStats={[{ name: "TypeScript", percentage: 80, color: "#3178c6" }]}
        repoCount={5}
        canCompare={false}
        onCompare={vi.fn()}
      />
    );
    expect(screen.getByText(/Distribuição de Stacks/i)).toBeInTheDocument();
  });
});
