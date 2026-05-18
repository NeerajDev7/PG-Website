import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { logout } from '../utils/auth'
import ThemeSwitcher from './ThemeSwitcher'

function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const tenants = useSelector((state) => state.tenants.tenants)

    const notifCount = tenants.filter(t => !t.paid).length

    const links = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Tenants', path: '/tenants' },
        { label: 'Rooms', path: '/rooms' },
        { label: 'Notifications', path: '/notifications', badge: notifCount },
        { label: 'Menu Manager', path: '/menu-manager' },
    ]

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <>
            {/* Mobile Top Bar */}
            <div
                className='md:hidden flex justify-between items-center px-6 py-4 fixed top-0 left-0 right-0 z-50'
                style={{ backgroundColor: 'var(--sidebar-bg)' }}
            >
                <h1 className='text-lg font-bold tracking-wide' style={{ color: 'var(--text-accent)' }}>
                    Social Co-Living PG
                </h1>
            </div>

            {/* Desktop Sidebar */}
            <div
                className='hidden md:flex w-56 flex-col justify-between'
                style={{ backgroundColor: 'var(--sidebar-bg)', minHeight: '100vh' }}
            >
                <div>
                    <div className='px-6 py-6' style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
                        <h1 className='text-lg font-bold tracking-wide' style={{ color: 'var(--text-accent)' }}>
                            Social Co-Living PG
                        </h1>
                    </div>
                    <nav className='flex flex-col p-4 gap-1'>
                        {links.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className='text-left px-4 py-3 rounded-lg transition flex justify-between items-center'
                                style={location.pathname === link.path
                                    ? { backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--sidebar-active-text)', fontWeight: '700' }
                                    : { color: 'var(--sidebar-text)' }
                                }
                                onMouseEnter={e => {
                                    if (location.pathname !== link.path) {
                                        e.currentTarget.style.backgroundColor = 'var(--sidebar-hover-bg)'
                                        e.currentTarget.style.color = 'var(--text-light)'
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (location.pathname !== link.path) {
                                        e.currentTarget.style.backgroundColor = 'transparent'
                                        e.currentTarget.style.color = 'var(--sidebar-text)'
                                    }
                                }}
                            >
                                {link.label}
                                {link.badge > 0 && (
                                    <span className='text-xs font-bold px-2 py-0.5 rounded-full' style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}>
                                        {link.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className='p-4 flex flex-col gap-4' style={{ borderTop: '1px solid var(--sidebar-border)' }}>
                    <ThemeSwitcher />
                    <button
                        onClick={handleLogout}
                        className='w-full px-4 py-3 rounded-lg font-semibold hover:opacity-80 transition'
                        style={{ backgroundColor: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)' }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    )
}

export default Sidebar