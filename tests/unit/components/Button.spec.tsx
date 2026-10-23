import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Button from "../../../src/components/ui/Button";

describe("Button component", () => {
  it("renders children content correctly", () => {
    render(<Button>Buscar Perfil</Button>);
    const buttonElement = screen.getByRole("button", { name: /buscar perfil/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();
    render(<Button onClick={onClickMock}>Salvar candidato</Button>);
    const buttonElement = screen.getByRole("button", { name: /salvar candidato/i });
    await user.click(buttonElement);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick handler when disabled", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();
    render(<Button disabled onClick={onClickMock}>Carregando...</Button>);
    const buttonElement = screen.getByRole("button", { name: /carregando/i });
    await user.click(buttonElement);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it("renders with default variant primary", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-primary");
  });

  it("renders with loading when isLoading is true", () => {
    render(<Button isLoading={true}>Test</Button>);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement.querySelector(".loading-spinner")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(<Button icon={<span data-testid="button-icon">Icon</span>}>Test</Button>);
    expect(screen.getByTestId("button-icon")).toBeInTheDocument();
  });

  it("applies fullWidth class when fullWidth is true", () => {
    render(<Button fullWidth={true}>Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading={true}>Test</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});