import { Navigate } from 'react-router-dom'

function ProtectedTenantRoute({ children }) {
    const isAuth = sessionStorage.getItem('tenant-auth') === 'true'
    if (!isAuth) {
        return <Navigate to='/login' replace />
    }
    return children
}

export default ProtectedTenantRoute