import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { markAsPaid, removeTenant } from '../store/tenantSlice'
import { vacateRoom } from '../store/roomsSlice'
import Sidebar from '../components/Sidebar'

function TenantsPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const tenants = useSelector((state) => state.tenants.tenants)

    const handleRemove = (tenant) => {
        const roomNumber = tenant.room.replace(/\D/g, '')
        dispatch(removeTenant(tenant.id))
        dispatch(vacateRoom(roomNumber))
    }

    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Sidebar />
            <div className='flex-1 p-8'>
                <div className='flex justify-between items-center mb-8'>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-800'>Tenants</h1>
                        <p className='text-gray-500'>{tenants.length} active tenants</p>
                    </div>
                    <button
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium"
                        onClick={() => navigate('/add-tenant')}
                    >
                        + Add Tenant
                    </button>
                </div>

                <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-100'>
                            <tr>
                                <th className='text-left px-6 py-4 text-sm text-gray-500 font-medium'>Name</th>
                                <th className='text-left px-6 py-4 text-sm text-gray-500 font-medium'>Room</th>
                                <th className='text-left px-6 py-4 text-sm text-gray-500 font-medium'>Rent</th>
                                <th className='text-left px-6 py-4 text-sm text-gray-500 font-medium'>Status</th>
                                <th className='text-left px-6 py-4 text-sm text-gray-500 font-medium'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((tenant) => (
                                <tr key={tenant.id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className='px-6 py-4 font-medium text-gray-800'>{tenant.name}</td>
                                    <td className='px-6 py-4 text-gray-500'>{tenant.room}</td>
                                    <td className='px-6 py-4 font-medium text-gray-800'>₹{tenant.rent}</td>
                                    <td className='px-6 py-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tenant.paid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                            {tenant.paid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 flex gap-2'>
                                        {!tenant.paid && (
                                            <button
                                                onClick={() => dispatch(markAsPaid(tenant.id))}
                                                className='text-sm bg-green-50 text-green-600 px-4 py-1.5 rounded-lg font-medium hover:bg-green-100 transition'
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRemove(tenant)}
                                            className='text-sm bg-red-50 text-red-500 px-4 py-1.5 rounded-lg font-medium hover:bg-red-100 transition'
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TenantsPage