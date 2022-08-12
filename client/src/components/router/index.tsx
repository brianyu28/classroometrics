import { BrowserRouter, Route, Routes } from "react-router-dom";

import DashboardManager from "crmet/components/dashboard-manager";
import Dashboards from 'crmet/components/dashboards';
import App from 'crmet/components/app';
import Login from 'crmet/components/login';
import UserAuthContext from 'crmet/contexts/UserAuthContext';
import { useUserAuth } from 'crmet/util/hooks';

import './style.scss';
import { useEffect } from "react";

function Router() {

    const [userAuth, setUserAuth, isLoading, handleLogout] = useUserAuth();
    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }

    const authContext = { userAuth, handleLogout };

    return (
        <BrowserRouter>
            <UserAuthContext.Provider value={authContext}>
                <Routes>
                    <Route path="/app/login" element={<Login onUpdateUserAuth={setUserAuth} />} />
                    <Route path="/app" element={<App />}>
                        <Route path="rooms" element={<Dashboards />} />
                        <Route path="rooms/:dashboardIdentifier" element={<DashboardManager />} />
                        <Route path="*" element={<div>Page Not Found</div>} />
                    </Route>
                </Routes>
            </UserAuthContext.Provider>
        </BrowserRouter>
    )
}

export default Router;
