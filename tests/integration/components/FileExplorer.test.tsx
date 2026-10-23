import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FileExplorer from "@/components/profile/repository/FileExplorer";

describe("FileExplorer", () => {
  it("renders project structure title", () => {
    render(
      <FileExplorer
        pathParts={[]}
        currentPath=""
        setCurrentPath={vi.fn()}
        handleBackClick={vi.fn()}
        sortedContents={[]}
        isLoading={false}
        error={null}
        setSelectedFilePath={vi.fn()}
      />
    );
    expect(screen.getByText(/Estrutura do Projeto/i)).toBeInTheDocument();
  });
});
