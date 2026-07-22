import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'
import PageTransition from '../components/PageTransition'

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
        <PageTransition>
            <div className='flex min-h-screen' style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <Sidebar />
                <div className='flex-1 p-4 md:p-8 mt-16 md:mt-0'>
                    <div className='mb-6'>
                        <h1 className='text-2xl md:text-3xl font-bold' style={{ color: 'var(--text-primary)' }}>Notifications</h1>
                        <p className='mt-1 text-sm' style={{ color: 'var(--text-secondary)' }}>{notifications.length} active alerts</p>
                    </div>

                    {notifications.length === 0 ? (
                        <div
                            className='rounded-xl p-10 md:p-16 text-center shadow-sm'
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                        >
                            <p className='text-5xl mb-4'>✅</p>
                            <p className='text-xl font-bold mb-1' style={{ color: 'var(--text-primary)' }}>All clear!</p>
                            <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>No pending rents or vacant rooms.</p>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-4'>
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className='rounded-xl p-4 md:p-5 flex items-start gap-4 shadow-sm'
                                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                                >
                                    <div className='text-2xl'>{n.type === 'warning' ? '⚠️' : '🏠'}</div>
                                    <div>
                                        <p
                                            className='font-bold text-sm mb-1'
                                            style={{ color: n.type === 'warning' ? 'var(--accent)' : 'var(--bg-secondary)' }}
                                        >
                                            {n.title}
                                        </p>
                                        <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    )
}

export default NotificationsPage