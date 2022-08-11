/**
 * UserContext keeps track of the currently signed in user.
 * When the context is `null`, there is no user provided.
 */
import { createContext } from "react";

const UserContext = createContext(null);

export default UserContext;
