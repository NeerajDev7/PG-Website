import { useSelector, useDispatch } from 'react-redux'
import { resetMonth } from '../store/tenantSlice'
import Sidebar from '../components/Sidebar'
import toast from 'react-hot-toast'
import PageTransition from '../components/PageTransition'
import ComplaintsSection from '../components/ComplaintsSection'

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
        if (confirmed) {
            dispatch(resetMonth())
            toast.success('New month started — all rents reset!')
        }
    }

    const stats = [
        { label: 'Total Rooms', value: totalRooms, icon: '🏠' },
        { label: 'Occupied', value: occupied, icon: '👥' },
        { label: 'Vacant', value: vacant, icon: '🔑' },
        { label: 'Rent Pending', value: rentPending, icon: '⚠️' },
    ]

    return (
        <PageTransition>
            <div className='flex min-h-screen' style={{ backgroundColor: '#F7F1E8' }}>
                <Sidebar />
                <div className='flex-1 p-4 md:p-8 mt-16 md:mt-0'>
                    <div className='flex justify-between items-center mb-2'>
                        <div>
                            <h1 className='text-2xl md:text-3xl font-bold' style={{ color: '#1B3A2D' }}>Dashboard</h1>
                            <p className='mt-1 text-sm' style={{ color: '#6b7c74' }}>{getGreeting()}, owner</p>
                        </div>
                        <button
                            onClick={handleResetMonth}
                            style={{ backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }}
                            className='px-3 py-2 md:px-5 md:py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition'
                        >
                            Reset Month
                        </button>
                    </div>

                    {/* Stats */}
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-8'>
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className='rounded-xl p-4 md:p-6 shadow-sm'
                                style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                            >
                                <div className='text-2xl md:text-3xl mb-2'>{stat.icon}</div>
                                <p className='text-xs md:text-sm mb-1' style={{ color: '#6b7c74' }}>{stat.label}</p>
                                <p className='text-3xl md:text-4xl font-bold' style={{ color: '#1B3A2D' }}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Complaints */}
                    <div className='mb-2'>
                        <h2 className='text-xl font-bold mb-1' style={{ color: '#1B3A2D' }}>Tenant Complaints</h2>
                        <p className='text-sm mb-4' style={{ color: '#6b7c74' }}>Review and resolve complaints raised by tenants</p>
                        <ComplaintsSection />
                    </div>

                </div>
            </div>
        </PageTransition>
    )
}

export default Dashboard