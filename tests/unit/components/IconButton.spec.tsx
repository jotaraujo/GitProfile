import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import IconButton from "../../../src/components/ui/IconButton";

describe("IconButton component", () => {
  (it("renders children content correctly", () => {
    render(<IconButton icon={<span data-testid="icon">Icon</span>} />);

    const buttonElement = screen.getByRole("button");

    expect(buttonElement).toBeDefined();
  }),
    it("calls the onClick handler when clicked", async () => {
      const user = userEvent.setup();
      const onClickMock = vi.fn();

      render(
        <IconButton
          icon={<span data-testid="icon">Icon</span>}
          onClick={onClickMock}
        />,
      );

      const buttonElement = screen.getByRole("button");
      await user.click(buttonElement);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    }),
    it("should not call the onClick handler when disabled", async () => {
      const user = userEvent.setup();
      const onClickMock = vi.fn();

      render(
        <IconButton
          icon={<span data-testid="icon">Icon</span>}
          disabled
          onClick={onClickMock}
        />,
      );

      const buttonElement = screen.getByRole("button");
      await user.click(buttonElement);

      expect(onClickMock).not.toHaveBeenCalled();
    }));
});
