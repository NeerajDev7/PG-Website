import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'

function Dashboard() {
    const navigate = useNavigate()
    const tenants = useSelector((state) => state.tenants.tenants)
    const rooms = useSelector((state) => state.rooms.rooms)

    const totalRooms = rooms.length
    const occupied = rooms.filter(r => r.occupied).length
    const vacant = rooms.filter(r => !r.occupied).length
    const rentPending = tenants.filter(t => !t.paid).length

    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Sidebar />
            <div className='flex-1 p-8'>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Dashboard</h1>
                <p className='text-gray-500 mb-8'>Good morning, owner</p>
                <div className='grid grid-cols-4 gap-6'>
                    {[
                        { label: 'Total Rooms', value: totalRooms },
                        { label: 'Occupied', value: occupied },
                        { label: 'Vacant', value: vacant },
                        { label: 'Rent Pending', value: rentPending },
                    ].map((stat) => (
                        <div key={stat.label} className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                            <p className='text-gray-500 text-sm mb-2'>{stat.label}</p>
                            <p className='text-3xl font-bold text-gray-800'>{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard