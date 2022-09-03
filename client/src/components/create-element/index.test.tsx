import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import CreateElement from ".";

const mockOnAddElement = jest.fn();
const mockToggleCreateElementViewOpen = jest.fn();

describe("CreateElement", () => {
  test("renders form to create element", () => {
    render(
      <CreateElement
        roomId={1}
        groupIndex={1}
        onAddElement={mockOnAddElement}
        toggleCreateElementViewOpen={mockToggleCreateElementViewOpen}
      />
    );
    expect(screen.queryByText("Create Element")).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Link (optional)" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Visible?" })
    ).toBeInTheDocument();
  });

  test("toggles view visibility when cancel button is pressed", () => {
    render(
      <CreateElement
        roomId={1}
        groupIndex={1}
        onAddElement={mockOnAddElement}
        toggleCreateElementViewOpen={mockToggleCreateElementViewOpen}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockToggleCreateElementViewOpen.mock.calls.length).toBe(1);
  });

  test("triggers adding a new element when form is submitted", () => {
    render(
      <CreateElement
        roomId={1}
        groupIndex={1}
        onAddElement={mockOnAddElement}
        toggleCreateElementViewOpen={mockToggleCreateElementViewOpen}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(mockOnAddElement.mock.calls.length).toBe(1);
    expect(mockToggleCreateElementViewOpen.mock.calls.length).toBe(0);
  });
});
