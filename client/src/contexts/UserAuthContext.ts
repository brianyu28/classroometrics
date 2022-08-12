/**
 * UserContext keeps track of the currently signed in user.
 * When the context is `null`, there is no user provided.
 */
import { createContext } from "react";

import { UserAuthentication } from "crmet/data/User";

interface UserAuthContextProps {
    userAuth: UserAuthentication | null,
    handleLogout: () => void,
}

const UserAuthContext = createContext<UserAuthContextProps>({
    userAuth: null,
    handleLogout: () => {},
});

export default UserAuthContext;
