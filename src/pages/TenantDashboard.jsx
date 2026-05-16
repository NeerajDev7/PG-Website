import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
function TenantDashboard() {
    const navigate = useNavigate()
    const tenants = useSelector((state) => state.tenants.tenants)
    const rooms = useSelector((state) => state.tenants.rooms)

    const tenantId = Number(sessionStorage.getItem('tenant-id'))
    const tenant = tenants.find(t => t.id === tenantId)

    const room = rooms.find(r => r.number === tenant?.room?.replace('Room ', ''))

    const handleLogout = () => {
        sessionStorage.removeItem('tenant-auth')
        sessionStorage.removeItem('tenant-id')
        navigate('/')
    }

    if (!tenant) {
        return (
            <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: '#F7F1E8' }}>
                <p style={{ color: '#1B3A2D' }}>Tenant not found. Please login again.</p>
            </div>
        )
    }

    return (
        <PageTransition>
        <div className='min-h-screen' style={{ backgroundColor: '#F7F1E8' }}>

            {/* Navbar */}
            <nav style={{ backgroundColor: '#2D5A40' }} className='flex justify-between items-center px-6 md:px-10 py-5'>
                <h1 className='text-lg md:text-xl font-bold tracking-wide' style={{ color: '#C9A84C' }}>
                    Social Co-Living PG
                </h1>
                <div className='flex items-center gap-4'>
                    <span className='text-sm font-medium hidden md:block' style={{ color: '#a0b8a8' }}>
                        Hey, {tenant.name.split(' ')[0]} 👋
                    </span>
                    <button
                        onClick={handleLogout}
                        className='px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition'
                        style={{ border: '1px solid #dc2626', color: '#dc2626' }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className='max-w-4xl mx-auto p-6 md:p-10'>

                {/* Welcome */}
                <div className='mb-8'>
                    <h2 className='text-2xl md:text-3xl font-bold' style={{ color: '#1B3A2D' }}>
                        Welcome, {tenant.name} 🏠
                    </h2>
                    <p className='mt-1 text-sm' style={{ color: '#6b7c74' }}>
                        Here's your stay summary
                    </p>
                </div>

                {/* Status Cards */}
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
                    <div
                        className='rounded-xl p-5 shadow-sm'
                        style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                    >
                        <p className='text-xs mb-1' style={{ color: '#6b7c74' }}>Your Room</p>
                        <p className='text-2xl font-bold' style={{ color: '#1B3A2D' }}>{tenant.room}</p>
                    </div>
                    <div
                        className='rounded-xl p-5 shadow-sm'
                        style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                    >
                        <p className='text-xs mb-1' style={{ color: '#6b7c74' }}>Monthly Rent</p>
                        <p className='text-2xl font-bold' style={{ color: '#C9A84C' }}>₹{tenant.rent}</p>
                    </div>
                    <div
                        className='col-span-2 md:col-span-1 rounded-xl p-5 shadow-sm'
                        style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                    >
                        <p className='text-xs mb-1' style={{ color: '#6b7c74' }}>Rent Status</p>
                        <span
                            className='text-sm font-bold px-3 py-1 rounded-full'
                            style={tenant.paid
                                ? { backgroundColor: '#2D5A40', color: '#C9A84C' }
                                : { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffc107' }
                            }
                        >
                            {tenant.paid ? '✅ Paid' : '⚠️ Pending'}
                        </span>
                    </div>
                </div>

                {/* Room Details */}
                <div
                    className='rounded-xl p-6 shadow-sm mb-6'
                    style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                >
                    <h3 className='font-bold text-lg mb-4' style={{ color: '#1B3A2D' }}>Room Details</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <p className='text-xs mb-1' style={{ color: '#6b7c74' }}>Room Number</p>
                            <p className='font-semibold' style={{ color: '#1B3A2D' }}>{tenant.room}</p>
                        </div>
                        <div>
                            <p className='text-xs mb-1' style={{ color: '#6b7c74' }}>Room Type</p>
                            <p className='font-semibold' style={{ color: '#1B3A2D' }}>{room?.type || '—'}</p>
                        </div>
                        <div>
                            <p className='text-xs mb-1' style={{ color: '#6b7c74' }}>Monthly Rent</p>
                            <p className='font-semibold' style={{ color: '#C9A84C' }}>₹{room?.price || tenant.rent}</p>
                        </div>
                        <div>
                            <p className='text-xs mb-1' style={{ color: '#6b7c74' }}>Status</p>
                            <p className='font-semibold' style={{ color: '#1B3A2D' }}>Active</p>
                        </div>
                    </div>
                </div>

                {/* Rent History */}
                <div
                    className='rounded-xl p-6 shadow-sm mb-6'
                    style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                >
                    <h3 className='font-bold text-lg mb-4' style={{ color: '#1B3A2D' }}>Rent History</h3>
                    {tenant.rentHistory && tenant.rentHistory.length > 0 ? (
                        <table className='w-full'>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E8DFC8' }}>
                                    <th className='text-left py-2 text-xs font-semibold' style={{ color: '#6b7c74' }}>Month</th>
                                    <th className='text-left py-2 text-xs font-semibold' style={{ color: '#6b7c74' }}>Date</th>
                                    <th className='text-left py-2 text-xs font-semibold' style={{ color: '#6b7c74' }}>Amount</th>
                                    <th className='text-left py-2 text-xs font-semibold' style={{ color: '#6b7c74' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenant.rentHistory.map((entry, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #F0EAD8' }}>
                                        <td className='py-3 text-sm' style={{ color: '#1B3A2D' }}>{entry.month}</td>
                                        <td className='py-3 text-sm' style={{ color: '#6b7c74' }}>{entry.date}</td>
                                        <td className='py-3 text-sm font-semibold' style={{ color: '#C9A84C' }}>₹{entry.amount}</td>
                                        <td className='py-3'>
                                            <span className='text-xs font-bold px-2 py-1 rounded-full' style={{ backgroundColor: '#2D5A40', color: '#C9A84C' }}>
                                                Paid
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className='text-sm' style={{ color: '#6b7c74' }}>No payment history yet.</p>
                    )}
                </div>

                {/* PG Info */}
                <div
                    className='rounded-xl p-6 shadow-sm'
                    style={{ backgroundColor: '#1B3A2D', border: '1px solid #C9A84C' }}
                >
                    <h3 className='font-bold text-lg mb-4' style={{ color: '#C9A84C' }}>PG Information</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                            <p className='text-xs mb-1' style={{ color: '#a0b8a8' }}>Address</p>
                            <p className='text-sm font-medium' style={{ color: '#F7F1E8' }}>12th Cross, Kaveri layout, Marathahalli Village, Bangalore</p>
                        </div>
                        <div>
                            <p className='text-xs mb-1' style={{ color: '#a0b8a8' }}>Contact</p>
                            <p className='text-sm font-medium' style={{ color: '#F7F1E8' }}>+91 9876543210</p>
                        </div>
                        <div>
                            <p className='text-xs mb-1' style={{ color: '#a0b8a8' }}>Email</p>
                            <p className='text-sm font-medium' style={{ color: '#F7F1E8' }}>owner@gmail.com</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </PageTransition>
    )
}

export default TenantDashboard