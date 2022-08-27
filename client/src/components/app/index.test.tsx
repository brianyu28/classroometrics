import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from ".";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UserAuthContext, {
  UserAuthContextProps,
} from "crmet/contexts/UserAuthContext";

const TEST_LOGIN_VIEW = "Test: Login view.";
const guestAuthContext: UserAuthContextProps = {
  userAuth: null,
  handleLogout: () => {},
};
const userAuthContext: UserAuthContextProps = {
  userAuth: { authenticated: true, user: { id: 1, username: "username" } },
  handleLogout: () => {},
};

interface TestAppProps {
  authContext: UserAuthContextProps;
}

const TestApp = ({ authContext }: TestAppProps) => (
  <MemoryRouter initialEntries={["/app"]}>
    <UserAuthContext.Provider value={authContext}>
      <Routes>
        <Route path="/app" element={<App />} />
        <Route path="/app/login" element={<div>{TEST_LOGIN_VIEW}</div>} />
      </Routes>
    </UserAuthContext.Provider>
  </MemoryRouter>
);

describe("App", () => {
  test("renders", () => {
    render(<TestApp authContext={guestAuthContext} />);
  });

  test("brings guest user to login screen", () => {
    render(<TestApp authContext={guestAuthContext} />);
    expect(screen.queryByText(TEST_LOGIN_VIEW)).toBeInTheDocument();
  });

  test("does not bring authenticated user to login screen", () => {
    render(<TestApp authContext={userAuthContext} />);
    expect(screen.queryByText(TEST_LOGIN_VIEW)).not.toBeInTheDocument();
  });
});
