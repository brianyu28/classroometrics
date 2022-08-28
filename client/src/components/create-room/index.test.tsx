import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";

import CreateRoom from ".";

jest.mock("crmet/api/RoomClient", () => {
    return {
        __esModule: true,
        createRoom: jest.fn(() => Promise.resolve({ json: () => Promise.resolve({identifier: "mock_identifier"})})),
    }
});

const TestCreateRoom = () => (
    <MemoryRouter initialEntries={["/app/rooms"]}>
      <Routes>
        <Route path="/app/rooms" element={<CreateRoom />} />
        <Route path="/app/rooms/:roomIdentifier" element={<div>Mock room detail page.</div>} />
      </Routes>
    </MemoryRouter>
);

describe("CreateRoom", () => {
  test("renders form to create room", () => {
    render(<TestCreateRoom />);
    expect(screen.queryByText("Create a New Room")).toBeInTheDocument();
    expect(screen.queryByRole("textbox", {name: "identifier"})).toBeInTheDocument();
    expect(screen.queryByRole("textbox", {name: "title"})).toBeInTheDocument();
  });

  test("has disabled submit button if fields are not completed", () => {
    render(<TestCreateRoom />);
    expect(screen.queryByRole("button", {name: "Create"})).toBeDisabled();
  });

  test("has enabled submit button if fields are completed", () => {
    render(<TestCreateRoom />);
    fireEvent.change(screen.getByRole("textbox", {name: "identifier"}), {target: {value: "mock_identifier"}})
    fireEvent.change(screen.getByRole("textbox", {name: "title"}), {target: {value: "Mock Title"}})
    expect(screen.queryByRole("button", {name: "Create"})).toBeEnabled();
  });
});
