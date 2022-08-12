import { logout, me } from "crmet/api/AuthenticationClient";
import { UserAuthentication } from "crmet/data/User";
import { Ref, useEffect, useState } from "react";
import { useRef } from "react"

/**
 * Hook to set focus on an element.
 */
export function useFocus(): [Ref<any>, Function] {
    const ref = useRef(null)
    const focusRef = () => {
        ref.current !== null && ref.current.focus();
    }
    return [ref, focusRef];
}

/**
 * Hook to persist state in local storage.
 */
export function usePersistentState<T>(defaultValue: T, key: string): [T, (value: T) => void] {
    const [value, setValue] = useState(() => {
        const storageValue = window.localStorage.getItem(key);
        return storageValue !== null ? JSON.parse(storageValue) : defaultValue;
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

/**
 * Hook to get current user authentication.
 */
export function useUserAuth():
    [ UserAuthentication,
     (userAuth: UserAuthentication) => void,
     boolean,
     () => void,
    ]
{
    const [userAuth, setUserAuth] = useState<UserAuthentication | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        me()
        .then(res => res.json())
        .then((data: UserAuthentication) => {
            setUserAuth(data.authenticated ? data : null)
            setIsLoading(false);
        });
    }, []);

    const handleLogout = () => {
        logout(userAuth)
        .then(res => res.json())
        .then((data: UserAuthentication) => {
            if (!data.authenticated) {
                setUserAuth(null);
                setIsLoading(false);
            }
        })
    }

    return [userAuth, setUserAuth, isLoading, handleLogout];
}

