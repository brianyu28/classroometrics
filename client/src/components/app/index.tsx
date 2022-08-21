import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import UserAuthContext from "crmet/contexts/UserAuthContext";

function App() {
  const { userAuth } = useContext(UserAuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isUserLoggedIn = userAuth !== null && userAuth.authenticated;

  useEffect(() => {
    if (isUserLoggedIn && location.pathname == "/app/") {
      navigate("/app/rooms");
    }
  }, [location, isUserLoggedIn]);

  if (!isUserLoggedIn) {
    return <Navigate to="/app/login" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
