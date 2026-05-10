import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/auth'

function LoginPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleLogin = () => {
        if (form.username === 'admin' && form.password === 'pg1234') {
            login()
            navigate('/dashboard')
        } else {
            setError('Invalid username or password')
        }
    }

    return (
        <div className='min-h-screen flex' style={{ backgroundColor: '#F7F1E8' }}>
            {/* Left Panel */}
            <div
                className='hidden md:flex w-1/2 flex-col justify-between p-12'
                style={{ backgroundColor: '#1B3A2D' }}
            >
                <h1 className='text-2xl font-bold tracking-wide' style={{ color: '#C9A84C' }}>
                    Social Co-Living PG
                </h1>
                <div>
                    <p className='text-xs font-semibold tracking-widest mb-3' style={{ color: '#C9A84C' }}>
                        OWNER PORTAL
                    </p>
                    <h2 className='text-4xl font-bold leading-tight mb-4' style={{ color: '#F7F1E8' }}>
                        Manage your PG <br /> with ease.
                    </h2>
                    <p style={{ color: '#a0b8a8' }}>
                        Track tenants, rooms, rent — all in one place.
                    </p>
                </div>
                <p className='text-xs' style={{ color: '#2D5A40' }}>
                    © 2026 Social Co-Living PG
                </p>
            </div>

            {/* Right Panel */}
            <div className='flex-1 flex items-center justify-center px-8'>
                <div
                    className='w-full max-w-md rounded-2xl p-10 shadow-sm'
                    style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                >
                    <h2 className='text-2xl font-bold mb-1' style={{ color: '#1B3A2D' }}>Welcome back</h2>
                    <p className='text-sm mb-8' style={{ color: '#6b7c74' }}>Sign in to your owner account</p>

                    <div className='mb-5'>
                        <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>
                            Username
                        </label>
                        <input
                            name='username'
                            value={form.username}
                            onChange={handleChange}
                            placeholder='admin'
                            className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none'
                            style={{ border: '1px solid #C9A84C', backgroundColor: '#F7F1E8', color: '#1B3A2D' }}
                        />
                    </div>

                    <div className='mb-3'>
                        <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>
                            Password
                        </label>
                        <input
                            name='password'
                            type='password'
                            value={form.password}
                            onChange={handleChange}
                            placeholder='••••••'
                            className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none'
                            style={{ border: '1px solid #C9A84C', backgroundColor: '#F7F1E8', color: '#1B3A2D' }}
                        />
                    </div>

                    {error && (
                        <p className='text-sm mb-4 font-medium' style={{ color: '#dc2626' }}>{error}</p>
                    )}

                    <button
                        onClick={handleLogin}
                        className='w-full py-3 rounded-lg font-bold text-lg hover:opacity-90 transition mt-5'
                        style={{ backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }}
                    >
                        Sign In
                    </button>

                    <p className='text-center text-sm mt-6' style={{ color: '#6b7c74' }}>
                        Not an owner?{' '}
                        <span
                            className='font-semibold cursor-pointer hover:opacity-80'
                            style={{ color: '#1B3A2D' }}
                            onClick={() => navigate('/')}
                        >
                            Back to home
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage