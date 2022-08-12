export interface User {
    id: number;
    username: string;
}

export interface UserAuthentication {
    authenticated: boolean;
    user: User;
    token: string;
}
