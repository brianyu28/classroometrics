import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import UserAuthContext from "crmet/contexts/UserAuthContext";
import { UserAuthentication } from "crmet/data/User";

function App() {

    const { userAuth, handleLogout } = useContext(UserAuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const isUserLoggedIn = userAuth !== null && userAuth.authenticated;

    useEffect(() => {
        if (isUserLoggedIn && location.pathname == '/app/') {
            navigate('/app/dashboards');
        }
    }, [location, isUserLoggedIn]);

    if (!isUserLoggedIn) {
        return <Navigate to="/app/login" />
    }

    return (
        <div>
            User is logged in: {userAuth.user.username}.
            <Outlet />
            <div>
                <button onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    )
}

export default App;
