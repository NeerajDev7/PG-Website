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
        <div className='w-56 bg-white shadow-sm flex flex-col'>
            <div className='px-6 py-6 border-b border-gray-100'>
                <h1 className='text-xl font-bold text-blue-600'>Social Co-Living PG</h1>
            </div>
            <nav className='flex flex-col p-4 gap-1'>
                {links.map((link) => (
                    <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className={`text-left px-4 py-3 rounded-lg transition flex justify-between items-center ${
                            location.pathname === link.path
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {link.label}
                        {link.badge > 0 && (
                            <span className='bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full'>
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