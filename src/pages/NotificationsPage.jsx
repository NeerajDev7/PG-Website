import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'

function NotificationsPage() {
    const tenants = useSelector((state) => state.tenants.tenants)
    const rooms = useSelector((state) => state.rooms.rooms)

    const notifications = []

    // Pending rent alerts
    tenants.filter(t => !t.paid).forEach(t => {
        notifications.push({
            id: `rent-${t.id}`,
            type: 'warning',
            title: 'Rent Pending',
            message: `${t.name} (${t.room}) hasn't paid this month.`,
        })
    })

    // Vacant room alerts
    rooms.filter(r => !r.occupied).forEach(r => {
        notifications.push({
            id: `room-${r.id}`,
            type: 'info',
            title: 'Vacant Room',
            message: `Room ${r.number} (${r.type}) is currently vacant.`,
        })
    })

    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Sidebar />
            <div className='flex-1 p-8'>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Notifications</h1>
                <p className='text-gray-500 mb-8'>{notifications.length} active alerts</p>

                {notifications.length === 0 ? (
                    <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center'>
                        <p className='text-4xl mb-4'>✅</p>
                        <p className='text-gray-800 font-semibold text-lg'>All clear!</p>
                        <p className='text-gray-400 text-sm mt-1'>No pending rents or vacant rooms.</p>
                    </div>
                ) : (
                    <div className='flex flex-col gap-4'>
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`bg-white rounded-xl border shadow-sm p-5 flex items-start gap-4 ${
                                    n.type === 'warning' ? 'border-red-100' : 'border-blue-100'
                                }`}
                            >
                                <div className={`text-2xl`}>
                                    {n.type === 'warning' ? '⚠️' : '🏠'}
                                </div>
                                <div>
                                    <p className={`font-semibold text-sm mb-1 ${
                                        n.type === 'warning' ? 'text-red-500' : 'text-blue-500'
                                    }`}>
                                        {n.title}
                                    </p>
                                    <p className='text-gray-600 text-sm'>{n.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationsPage