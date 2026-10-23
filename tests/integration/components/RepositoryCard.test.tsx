import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import RepositoryCard from "@/components/profile/repository/RepositoryCard";

describe("RepositoryCard", () => {
  it("renders repository name", () => {
    const mockRepo = {
      id: 1,
      name: "test-repo",
      private: false,
      owner: { login: "testuser", name: "Test User", avatar_url: "https://example.com/avatar.png" },
      html_url: "https://example.com/repo",
      description: "A test repo",
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
      size: 100,
      stargazers_count: 10,
      watchers_count: 5,
      language: "TypeScript",
      forks_count: 2,
    };
    render(
      <MemoryRouter>
        <RepositoryCard repository={mockRepo as any} />
      </MemoryRouter>
    );
    expect(screen.getByText(/test-repo/i)).toBeInTheDocument();
  });
});
