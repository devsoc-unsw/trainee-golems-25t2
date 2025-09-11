import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "../Components/Navbar";
import { vi } from "vitest";

// Mock Clerk so tests don't require ClerkProvider
vi.mock("@clerk/clerk-react", () => ({
  SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedIn: () => null,
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  UserButton: () => <div>User</div>,
}));

const renderNavbar = (props = {}) => {
  return render(
    <BrowserRouter>
      <Navbar {...props} />
    </BrowserRouter>
  );
};

describe("Navbar", () => {
  test("renders with custom brand name", () => {
    renderNavbar({ brandName: "StuVerse" });
    const brandElement = screen.getByText("StuVerse");
    expect(brandElement).toBeDefined();
  });

  test("renders navigation links (Home, Features, Contact)", () => {
    renderNavbar();
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Features")).toBeDefined();
    expect(screen.getByText("Contact")).toBeDefined();
  });

  test("renders Sign In button on the right", () => {
    renderNavbar();
    expect(screen.getByText("Sign In")).toBeDefined();
  });
});
