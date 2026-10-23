import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import IconButton from "../../../src/components/ui/IconButton";

describe("IconButton component", () => {
  it("renders button correctly", () => {
    render(<IconButton icon={<span data-testid="icon">Icon</span>} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();
    render(<IconButton icon={<span>Icon</span>} onClick={onClickMock} />);
    await user.click(screen.getByRole("button"));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();
    render(<IconButton icon={<span>Icon</span>} disabled onClick={onClickMock} />);
    await user.click(screen.getByRole("button"));
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it("applies tooltip as title", () => {
    render(<IconButton icon={<span>Icon</span>} tooltip="Close" />);
    expect(screen.getByRole("button")).toHaveAttribute("title", "Close");
  });

  it("renders icon content", () => {
    render(<IconButton icon={<span data-testid="my-icon">X</span>} />);
    expect(screen.getByTestId("my-icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<IconButton icon={<span>Icon</span>} className="custom" />);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("renders with size sm by default", () => {
    render(<IconButton icon={<span>Icon</span>} />);
    expect(screen.getByRole("button")).toHaveClass("btn-sm");
  });

  it("renders with size md when specified", () => {
    render(<IconButton icon={<span>Icon</span>} size="md" />);
    expect(screen.getByRole("button")).toHaveClass("btn-md");
  });
});