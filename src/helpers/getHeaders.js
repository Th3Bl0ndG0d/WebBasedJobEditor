
export function getHeaders(token) {
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
}
