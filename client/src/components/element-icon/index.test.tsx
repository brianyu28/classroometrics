import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ElementIcon from ".";

describe("ElementIcon", () => {
  test("renders an image", () => {
    render(<ElementIcon icon="" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});
