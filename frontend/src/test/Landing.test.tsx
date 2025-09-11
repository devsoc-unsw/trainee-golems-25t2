import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import { vi } from "vitest";

// Mock Ballpit to avoid WebGL in test environment
vi.mock("../Components/Ballpit", () => ({
  __esModule: true,
  default: () => <div data-testid="ballpit" />,
}));

// Mock Clerk hooks
vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({
    isSignedIn: false,
    isLoaded: true,
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignedIn: () => null,
  SignedOut: ({ children }: { children: React.ReactNode }) => children,
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  SignUpButton: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  UserButton: () => <div>UserButton</div>,
}));

// Mock useLoading hook
vi.mock("../hooks/useLoading", () => ({
  useLoading: () => ({
    isLoading: false,
    setLoading: vi.fn(),
  }),
}));

const renderLanding = () => {
  return render(
    <BrowserRouter>
      <Landing />
    </BrowserRouter>
  );
};

describe("Landing Page", () => {
  test("renders headers", () => {
    renderLanding();
    expect(screen.getByText(/Your Student/i)).toBeDefined();
    expect(screen.getByText(/Assistance Tool/i)).toBeDefined();
    expect(screen.getByText("All-In-One Place")).toBeDefined();
  });

  test("renders centered Get Started button", () => {
    renderLanding();
    // Ensure button text is present
    expect(screen.getByText("Get Started")).toBeDefined();
  });
});
