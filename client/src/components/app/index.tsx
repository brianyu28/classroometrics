
import Login from 'crmet/components/login';
import UserAuthContext from 'crmet/contexts/UserAuthContext';
import { UserAuthentication } from 'crmet/data/User';
import { usePersistentState, useUserAuth } from 'crmet/util/hooks';

import './style.scss';

function App() {

    const [userAuth, setUserAuth, isLoading, handleLogout] = useUserAuth();

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }

    const isUserLoggedIn = userAuth !== null && userAuth.authenticated;
    if (!isUserLoggedIn) {
        return (
            <div>
                <Login
                    onUpdateUserAuth={setUserAuth}
                />
            </div>
        );
    }

    return (
        <UserAuthContext.Provider value={userAuth}>
            <div>
                User is logged in: {userAuth.user.username}.
                <div>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            </div>
        </UserAuthContext.Provider>
    )
}

export default App;
