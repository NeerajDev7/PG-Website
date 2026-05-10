export const login = () => {
    sessionStorage.setItem('pg-auth', 'true')
}

export const logout = () => {
    sessionStorage.removeItem('pg-auth')
}

export const isAuthenticated = () => {
    return sessionStorage.getItem('pg-auth') === 'true'
}