import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()

    const tenants = useSelector((state) => state.tenants.tenants)
    const rooms = useSelector((state) => state.rooms.rooms)

    const notifCount =
        tenants.filter(t => !t.paid).length +
        rooms.filter(r => !r.occupied).length

    const links = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Tenants', path: '/tenants' },
        { label: 'Rooms', path: '/rooms' },
        { label: 'Notifications', path: '/notifications', badge: notifCount },
    ]

    return (
        <div className='w-56 flex flex-col' style={{ backgroundColor: '#1B3A2D', minHeight: '100vh' }}>
            <div className='px-6 py-6' style={{ borderBottom: '1px solid #2D5A40' }}>
                <h1 className='text-lg font-bold tracking-wide' style={{ color: '#C9A84C' }}>
                    Social Co-Living PG
                </h1>
            </div>
            <nav className='flex flex-col p-4 gap-1'>
                {links.map((link) => (
                    <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
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
    )
}

export default Sidebar