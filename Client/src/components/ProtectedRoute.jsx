import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const [status, setStatus] = useState('checking') // 'checking' | 'authenticated' | 'unauthenticated'

    useEffect(() => {
        fetch('https://pg-manager-backend-mryl.onrender.com/api/me', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn && data.role === 'owner') {
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
        return <Navigate to='/owner/login' replace />
    }

    return children
}

export default ProtectedRoute