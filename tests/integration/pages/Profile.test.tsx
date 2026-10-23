import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import Profile from "@/pages/Profile";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe("Profile Page", () => {
  it("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/profile/testuser']}>
          <Routes><Route path="/profile/:username" element={<Profile />} /></Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  });
});
