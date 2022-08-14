/**
 * API client.
 */

import { UserAuthentication } from "crmet/data/User";

const BASE_URL = '/api';

export function generateApiHeaders(auth: UserAuthentication | null) {
    if (auth === null) {
        return {};
    }
    return {
        Authorization: `token ${auth.token}`
    }
}

export function apiGet(auth: UserAuthentication | null, endpoint: string) {
    const url = BASE_URL + endpoint;
    return fetch(url, {
        headers: generateApiHeaders(auth)
    })
}

export function apiPost(auth: UserAuthentication | null, endpoint: string, data: object = null) {
    const url = BASE_URL + endpoint;
    const headers = {
        ...generateApiHeaders(auth),
        'Content-Type': 'application/json',
    }
    return fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data || {}),
    })
}

export function apiPut(auth: UserAuthentication | null, endpoint: string, data: object = null) {
    const url = BASE_URL + endpoint;
    const headers = {
        ...generateApiHeaders(auth),
        'Content-Type': 'application/json',
    }
    return fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data || {}),
    })
}
