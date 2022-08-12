/**
 * API client.
 */

import { UserAuthentication } from "crmet/data/User";

const BASE_URL = '/api';

export function generate_api_headers(auth: UserAuthentication | null) {
    if (auth === null) {
        return {};
    }
    return {
        Authorization: `token ${auth.token}`
    }
}

export function api_get(auth: UserAuthentication | null, endpoint: string) {
    const url = BASE_URL + endpoint;
    return fetch(url, {
        headers: generate_api_headers(auth)
    })
}

export function api_post(auth: UserAuthentication | null, endpoint: string, data: object = null) {
    const url = BASE_URL + endpoint;
    const headers = {
        ...generate_api_headers(auth),
        'Content-Type': 'application/json',
    }
    return fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data || {}),
    })
}
