import { useSelector, useDispatch } from 'react-redux'
import { resetMonth } from '../store/tenantSlice'
import Sidebar from '../components/Sidebar'

function Dashboard() {
    const dispatch = useDispatch()
    const tenants = useSelector((state) => state.tenants.tenants)
    const rooms = useSelector((state) => state.tenants.rooms)

    const totalRooms = rooms.length
    const occupied = rooms.filter(r =>
        tenants.some(t => t.room === `Room ${r.number}`)
    ).length
    const vacant = totalRooms - occupied
    const rentPending = tenants.filter(t => !t.paid).length

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 17) return 'Good afternoon'
        return 'Good evening'
    }

    const handleResetMonth = () => {
        const confirmed = window.confirm('Reset all rents to Pending for new month?')
        if (confirmed) dispatch(resetMonth())
    }

    const stats = [
        { label: 'Total Rooms', value: totalRooms, icon: '🏠' },
        { label: 'Occupied', value: occupied, icon: '👥' },
        { label: 'Vacant', value: vacant, icon: '🔑' },
        { label: 'Rent Pending', value: rentPending, icon: '⚠️' },
    ]

    return (
        <div className='flex min-h-screen' style={{ backgroundColor: '#F7F1E8' }}>
            <Sidebar />
            <div className='flex-1 p-8'>
                <div className='flex justify-between items-center mb-2'>
                    <div>
                        <h1 className='text-3xl font-bold' style={{ color: '#1B3A2D' }}>Dashboard</h1>
                        <p className='mt-1' style={{ color: '#6b7c74' }}>{getGreeting()}, owner</p>
                    </div>
                    <button
                        onClick={handleResetMonth}
                        style={{ backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }}
                        className='px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition'
                    >
                        Reset Month
                    </button>
                </div>

                <div className='grid grid-cols-4 gap-6 mt-8'>
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className='rounded-xl p-6 shadow-sm'
                            style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                        >
                            <div className='text-3xl mb-3'>{stat.icon}</div>
                            <p className='text-sm mb-1' style={{ color: '#6b7c74' }}>{stat.label}</p>
                            <p className='text-4xl font-bold' style={{ color: '#1B3A2D' }}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard