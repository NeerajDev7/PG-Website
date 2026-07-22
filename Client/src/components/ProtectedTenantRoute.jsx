import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedTenantRoute({ children }) {
    const [status, setStatus] = useState('checking')

    useEffect(() => {
        fetch('https://pg-manager-backend-mry1.onrender.com/api/me', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn && data.role === 'tenant') {
                    setStatus('authenticated')
                } else {
                    setStatus('unauthenticated')
                }
            })
            .catch(() => setStatus('unauthenticated'))
    }, [])

    if (status === 'checking') {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Checking session...</div>
    }

    if (status === 'unauthenticated') {
        return <Navigate to='/login' replace />
    }

    return children
}

export default ProtectedTenantRoute