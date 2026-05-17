import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { logout } from '../utils/auth'

function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const tenants = useSelector((state) => state.tenants.tenants)
    const [open, setOpen] = useState(false)

    const notifCount = tenants.filter(t => !t.paid).length

    const links = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Tenants', path: '/tenants' },
        { label: 'Rooms', path: '/rooms' },
        { label: 'Notifications', path: '/notifications', badge: notifCount },
    ]

    const handleNav = (path) => {
        navigate(path)
        setOpen(false)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <>
            {/* Mobile Top Bar */}
            <div
                className='md:hidden flex justify-between items-center px-6 py-4 fixed top-0 left-0 right-0 z-50'
                style={{ backgroundColor: '#1B3A2D' }}
            >
                <h1 className='text-lg font-bold tracking-wide' style={{ color: '#C9A84C' }}>
                    Social Co-Living PG
                </h1>
                <button
                    onClick={() => setOpen(!open)}
                    className='text-2xl font-bold'
                    style={{ color: '#C9A84C' }}
                >
                    {open ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {open && (
                <div
                    className='md:hidden fixed top-16 left-0 right-0 z-40 px-4 py-4 flex flex-col gap-2'
                    style={{ backgroundColor: '#1B3A2D' }}
                >
                    {links.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => handleNav(link.path)}
                            className='text-left px-4 py-3 rounded-lg flex justify-between items-center'
                            style={
                                location.pathname === link.path
                                    ? { backgroundColor: '#C9A84C', color: '#1B3A2D', fontWeight: '700' }
                                    : { color: '#a0b8a8' }
                            }
                        >
                            {link.label}
                            {link.badge > 0 && (
                                <span className='text-xs font-bold px-2 py-0.5 rounded-full' style={{ backgroundColor: '#C9A84C', color: '#1B3A2D' }}>
                                    {link.badge}
                                </span>
                            )}
                        </button>
                    ))}
                    <button
                        onClick={handleLogout}
                        className='w-full px-4 py-3 rounded-lg font-semibold mt-2'
                        style={{ color: '#dc2626', border: '1px solid #dc2626' }}
                    >
                        Logout
                    </button>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className='hidden md:flex w-56 flex-col justify-between' style={{ backgroundColor: '#1B3A2D', minHeight: '100vh' }}>
                <div>
                    <div className='px-6 py-6' style={{ borderBottom: '1px solid #2D5A40' }}>
                        <h1 className='text-lg font-bold tracking-wide' style={{ color: '#C9A84C' }}>
                            Social Co-Living PG
                        </h1>
                    </div>
                    <nav className='flex flex-col p-4 gap-1'>
                        {links.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => handleNav(link.path)}
                                className='text-left px-4 py-3 rounded-lg transition flex justify-between items-center'
                                style={
                                    location.pathname === link.path
                                        ? { backgroundColor: '#C9A84C', color: '#1B3A2D', fontWeight: '700' }
                                        : { color: '#a0b8a8' }
                                }
                                onMouseEnter={e => {
                                    if (location.pathname !== link.path) {
                                        e.currentTarget.style.backgroundColor = '#2D5A40'
                                        e.currentTarget.style.color = '#F7F1E8'
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (location.pathname !== link.path) {
                                        e.currentTarget.style.backgroundColor = 'transparent'
                                        e.currentTarget.style.color = '#a0b8a8'
                                    }
                                }}
                            >
                                {link.label}
                                {link.badge > 0 && (
                                    <span className='text-xs font-bold px-2 py-0.5 rounded-full' style={{ backgroundColor: '#C9A84C', color: '#1B3A2D' }}>
                                        {link.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className='p-4' style={{ borderTop: '1px solid #2D5A40' }}>
                    <button
                        onClick={handleLogout}
                        className='w-full px-4 py-3 rounded-lg font-semibold hover:opacity-80 transition'
                        style={{ backgroundColor: '#dc2626', color: '#ffffff', border: '1px solid #dc2626' }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    )
}

export default Sidebar