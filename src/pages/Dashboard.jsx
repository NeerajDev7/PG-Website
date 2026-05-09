import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import Sidebar from '../components/Sidebar'
import { resetMonth } from '../store/tenantSlice'
import { use } from 'react'

function Dashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const tenants = useSelector((state) => state.tenants.tenants)
    const rooms = useSelector((state) => state.rooms.rooms)

    const totalRooms = rooms.length
    const occupied = rooms.filter(r => r.occupied).length
    const vacant = rooms.filter(r => !r.occupied).length
    const rentPending = tenants.filter(t => !t.paid).length

    const getGreeting = () => {
        const hour = new Date().getHours()
        if(hour <  12) return 'Good morning'
        if(hour < 17) return 'Good afternoon'
        return 'Good evening'
    }

    const handleResetMonth = ()=>{
        const confirmed = window.confirm('Reset all rents to pending for new month?')
        if(confirmed) dispatch(resetMonth())
    }

    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Sidebar />
            <div className='flex-1 p-8'>
                <div className='flex justify-between items-center mb-2'>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
                        <p className='text-gray-500'>{getGreeting()}, owner</p>
                    </div>
                    <button
                        onClick={handleResetMonth}
                        className='bg-orange-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600 transition'
                    >
                        Reset Month
                    </button>
                </div>

                <div className='grid grid-cols-4 gap-6 mt-8'>
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