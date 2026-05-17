export const login = () => {
    localStorage.setItem('pg-auth', 'true')
}

export const logout = () => {
    localStorage.removeItem('pg-auth')
}

export const isAuthenticated = () => {
    return localStorage.getItem('pg-auth') === 'true'
}