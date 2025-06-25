
// Deze helper bevat de standaard gebruikers voor offline gebruik
export const DEFAULT_USERS = [
    {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin',
        role: 'Beheerder'
    },
    {
        username: 'operator',
        email: 'operator@example.com',
        password: 'operator',
        role: 'Operator'
    }
];

export function ensureDefaultUsersInStorage() {
    const stored = JSON.parse(localStorage.getItem('users')) || [];
    const updated = [...stored];

    DEFAULT_USERS.forEach(defaultUser => {
        const exists = stored.some(user => user.email === defaultUser.email);
        if (!exists) {
            updated.push(defaultUser);
        }
    });

    localStorage.setItem('users', JSON.stringify(updated));
}
