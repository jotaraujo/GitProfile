import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import NotificationPopover from "@/components/layout/NotificationPopover";

describe("NotificationPopover", () => {
  it("renders notifications title", () => {
    render(
      <MemoryRouter>
        <NotificationPopover isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Notificações/i)).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <MemoryRouter>
        <NotificationPopover isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.queryByText(/Notificações/i)).not.toBeInTheDocument();
  });
});
