/**
 * API client.
 */

const BASE_URL = '/api';

// https://docs.djangoproject.com/en/4.0/ref/csrf/
function getCookie(name: string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function generateApiHeaders() {
    return {
        'X-CSRFToken': getCookie('csrftoken')
    }
}

export function apiGet(endpoint: string) {
    const url = BASE_URL + endpoint;
    return fetch(url, {
        headers: generateApiHeaders()
    })
}

export function apiPost(endpoint: string, data: object = null) {
    const url = BASE_URL + endpoint;
    const headers = {
        ...generateApiHeaders(),
        'Content-Type': 'application/json',
    }
    return fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data || {}),
    })
}

export function apiPut(endpoint: string, data: object = null) {
    const url = BASE_URL + endpoint;
    const headers = {
        ...generateApiHeaders(),
        'Content-Type': 'application/json',
    }
    return fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data || {}),
    })
}
