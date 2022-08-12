/**
 * UserContext keeps track of the currently signed in user.
 * When the context is `null`, there is no user provided.
 */
import { createContext } from "react";

import { UserAuthentication } from "crmet/data/User";

const UserAuthContext = createContext<UserAuthentication>(null);

export default UserAuthContext;
