import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CandidateTriageForm from "@/components/profile/CandidateTriageForm";
import type { User } from "@/types/github";

const mockUser: User = { login: 'testuser', name: 'Test', avatar_url: 'url', bio: 'bio', html_url: 'url', location: 'loc', followers: 0, following: 0, public_gists: 0, company: null, created_at: '2023-01-01' };

describe("CandidateTriageForm", () => {
  it("renders triage form title", () => {
    render(<CandidateTriageForm user={mockUser} onClose={vi.fn()} />);
    expect(screen.getByText(/Triagem do Candidato/i)).toBeDefined();
  });
});
