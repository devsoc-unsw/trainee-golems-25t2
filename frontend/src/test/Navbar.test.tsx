import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "../Components/Navbar";

const renderNavbar = (props = {}) => {
  return render(
    <BrowserRouter>
      <Navbar {...props} />
    </BrowserRouter>
  );
};

describe("Navbar", () => {
  test("renders with default brand name", () => {
    renderNavbar();
    const brandElement = screen.getByText("MyApp");
    expect(brandElement).toBeDefined();
  });

  test("renders with custom brand name", () => {
    renderNavbar({ brandName: "CustomApp" });
    const brandElement = screen.getByText("CustomApp");
    expect(brandElement).toBeDefined();
  });

  test("renders navigation links", () => {
    renderNavbar();
    const homeLink = screen.getByText("Home");
    const aboutLink = screen.getByText("About");
    expect(homeLink).toBeDefined();
    expect(aboutLink).toBeDefined();
  });
});
