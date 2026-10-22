import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Button from "../../../src/components/ui/Button";

describe("Button component", () => {
  it("renders children content correctly", () => {
    render(<Button>Buscar Perfil</Button>);

    const buttonElement = screen.getByRole("button", {
      name: /buscar perfil/i,
    });

    expect(buttonElement).toBeDefined();
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();

    render(<Button onClick={onClickMock}>Salvar candidato</Button>);

    const buttonElement = screen.getByRole("button", {
      name: /salvar candidato/i,
    });

    await user.click(buttonElement);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick handler when disabled", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();

    render(
      <Button disabled onClick={onClickMock}>
        Carregando...
      </Button>,
    );

    const buttonElement = screen.getByRole("button", { name: /carregando/i });

    await user.click(buttonElement);

    expect(onClickMock).not.toHaveBeenCalled();
  });
});
