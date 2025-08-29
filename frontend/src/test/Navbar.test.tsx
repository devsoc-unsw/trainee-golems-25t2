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
  test("renders with custom brand name", () => {
    renderNavbar({ brandName: "StuVerse" });
    const brandElement = screen.getByText("StuVerse");
    expect(brandElement).toBeDefined();
  });

  test("renders navigation links", () => {
    renderNavbar();
    const aboutLink = screen.getByText("About");
    const featuresLink = screen.getByText("Features");
    const contactLink = screen.getByText("Contact");
    expect(aboutLink).toBeDefined();
    expect(featuresLink).toBeDefined();
    expect(contactLink).toBeDefined();
  });
});
