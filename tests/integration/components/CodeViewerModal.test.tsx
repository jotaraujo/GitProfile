import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CodeViewerModal from "@/components/profile/repository/CodeViewerModal";

describe("CodeViewerModal", () => {
  it("renders file path", () => {
    render(
      <CodeViewerModal
        filePath="src/test.ts"
        fileData={{ content: '', size: 100 }}
        isLoading={false}
        error={null}
        repository={{} as any}
        isBinary={false}
        isTooLarge={false}
        codeContent="console.log('test')"
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText("src/test.ts")).toBeInTheDocument();
  });
});
