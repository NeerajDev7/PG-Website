import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'

function NotificationsPage() {
    const tenants = useSelector((state) => state.tenants.tenants)
    const rooms = useSelector((state) => state.tenants.rooms)

    const notifications = []

    tenants.filter(t => !t.paid).forEach(t => {
        notifications.push({
            id: `rent-${t.id}`,
            type: 'warning',
            title: 'Rent Pending',
            message: `${t.name} (${t.room}) hasn't paid this month.`,
        })
    })

    rooms.filter(r => !tenants.some(t => t.room === `Room ${r.number}`)).forEach(r => {
        notifications.push({
            id: `room-${r.id}`,
            type: 'info',
            title: 'Vacant Room',
            message: `Room ${r.number} (${r.type}) is currently vacant.`,
        })
    })

    return (
        <div className='flex min-h-screen' style={{ backgroundColor: '#F7F1E8' }}>
            <Sidebar />
            <div className='flex-1 p-4 md:p-8 mt-16 md:mt-0'>
                <div className='mb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold' style={{ color: '#1B3A2D' }}>Notifications</h1>
                    <p className='mt-1 text-sm' style={{ color: '#6b7c74' }}>{notifications.length} active alerts</p>
                </div>

                {notifications.length === 0 ? (
                    <div
                        className='rounded-xl p-10 md:p-16 text-center shadow-sm'
                        style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                    >
                        <p className='text-5xl mb-4'>✅</p>
                        <p className='text-xl font-bold mb-1' style={{ color: '#1B3A2D' }}>All clear!</p>
                        <p className='text-sm' style={{ color: '#6b7c74' }}>No pending rents or vacant rooms.</p>
                    </div>
                ) : (
                    <div className='flex flex-col gap-4'>
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className='rounded-xl p-4 md:p-5 flex items-start gap-4 shadow-sm'
                                style={{
                                    backgroundColor: '#fff',
                                    border: n.type === 'warning'
                                        ? '1px solid #C9A84C'
                                        : '1px solid #2D5A40'
                                }}
                            >
                                <div className='text-2xl'>{n.type === 'warning' ? '⚠️' : '🏠'}</div>
                                <div>
                                    <p
                                        className='font-bold text-sm mb-1'
                                        style={{ color: n.type === 'warning' ? '#C9A84C' : '#2D5A40' }}
                                    >
                                        {n.title}
                                    </p>
                                    <p className='text-sm' style={{ color: '#6b7c74' }}>{n.message}</p>
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