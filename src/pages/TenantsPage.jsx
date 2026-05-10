import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { markAsPaid, removeTenant } from '../store/tenantSlice'
import Sidebar from '../components/Sidebar'

function TenantsPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const tenants = useSelector((state) => state.tenants.tenants)
    const [search, setSearch] = useState('')

    const filtered = tenants.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.room.toLowerCase().includes(search.toLowerCase())
    )

    const handleRemove = (tenant) => {
        const confirmed = window.confirm(`Remove ${tenant.name} from ${tenant.room}?`)
        if (!confirmed) return
        dispatch(removeTenant(tenant.id))
    }

    return (
        <div className='flex min-h-screen' style={{ backgroundColor: '#F7F1E8' }}>
            <Sidebar />
            <div className='flex-1 p-4 md:p-8 mt-16 md:mt-0'>

                <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6'>
                    <div>
                        <h1 className='text-2xl md:text-3xl font-bold' style={{ color: '#1B3A2D' }}>Tenants</h1>
                        <p className='mt-1 text-sm' style={{ color: '#6b7c74' }}>{tenants.length} active tenants</p>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-3'>
                        <input
                            type='text'
                            placeholder='Search by name or room...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='w-full sm:w-64 px-4 py-2 rounded-lg text-sm focus:outline-none'
                            style={{ border: '1px solid #C9A84C', backgroundColor: '#fff', color: '#1B3A2D' }}
                        />
                        <button
                            onClick={() => navigate('/add-tenant')}
                            style={{ backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }}
                            className='px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm whitespace-nowrap'
                        >
                            + Add Tenant
                        </button>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className='flex flex-col gap-4 md:hidden'>
                    {filtered.length === 0 ? (
                        <p className='text-center py-10' style={{ color: '#6b7c74' }}>No tenants found</p>
                    ) : (
                        filtered.map((tenant) => (
                            <div
                                key={tenant.id}
                                className='rounded-xl p-5 shadow-sm'
                                style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                            >
                                <div className='flex justify-between items-start mb-3'>
                                    <div>
                                        <p className='font-bold text-lg' style={{ color: '#1B3A2D' }}>{tenant.name}</p>
                                        <p className='text-sm' style={{ color: '#6b7c74' }}>{tenant.room}</p>
                                    </div>
                                    <span
                                        className='px-3 py-1 rounded-full text-xs font-bold'
                                        style={tenant.paid
                                            ? { backgroundColor: '#2D5A40', color: '#C9A84C' }
                                            : { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffc107' }
                                        }
                                    >
                                        {tenant.paid ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                                <p className='text-sm font-semibold mb-4' style={{ color: '#1B3A2D' }}>₹{tenant.rent}/month</p>
                                <div className='flex gap-2'>
                                    {!tenant.paid && (
                                        <button
                                            onClick={() => dispatch(markAsPaid(tenant.id))}
                                            className='flex-1 py-2 rounded-lg font-semibold text-sm'
                                            style={{ backgroundColor: '#2D5A40', color: '#C9A84C' }}
                                        >
                                            Mark Paid
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemove(tenant)}
                                        className='flex-1 py-2 rounded-lg font-semibold text-sm'
                                        style={{ backgroundColor: '#fff', color: '#dc2626', border: '1px solid #dc2626' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className='hidden md:block rounded-xl overflow-hidden shadow-sm' style={{ border: '1px solid #C9A84C' }}>
                    <table className='w-full'>
                        <thead>
                            <tr style={{ backgroundColor: '#1B3A2D' }}>
                                <th className='text-left px-6 py-4 text-sm font-semibold' style={{ color: '#C9A84C' }}>Name</th>
                                <th className='text-left px-6 py-4 text-sm font-semibold' style={{ color: '#C9A84C' }}>Room</th>
                                <th className='text-left px-6 py-4 text-sm font-semibold' style={{ color: '#C9A84C' }}>Rent</th>
                                <th className='text-left px-6 py-4 text-sm font-semibold' style={{ color: '#C9A84C' }}>Status</th>
                                <th className='text-left px-6 py-4 text-sm font-semibold' style={{ color: '#C9A84C' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan='5' className='px-6 py-10 text-center' style={{ color: '#6b7c74' }}>
                                        No tenants found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((tenant, index) => (
                                    <tr
                                        key={tenant.id}
                                        style={{
                                            backgroundColor: index % 2 === 0 ? '#fff' : '#F7F1E8',
                                            borderBottom: '1px solid #E8DFC8'
                                        }}
                                    >
                                        <td className='px-6 py-4 font-medium' style={{ color: '#1B3A2D' }}>{tenant.name}</td>
                                        <td className='px-6 py-4' style={{ color: '#6b7c74' }}>{tenant.room}</td>
                                        <td className='px-6 py-4 font-medium' style={{ color: '#1B3A2D' }}>₹{tenant.rent}</td>
                                        <td className='px-6 py-4'>
                                            <span
                                                className='px-3 py-1 rounded-full text-xs font-bold'
                                                style={tenant.paid
                                                    ? { backgroundColor: '#2D5A40', color: '#C9A84C' }
                                                    : { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffc107' }
                                                }
                                            >
                                                {tenant.paid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 flex gap-2'>
                                            {!tenant.paid && (
                                                <button
                                                    onClick={() => dispatch(markAsPaid(tenant.id))}
                                                    className='text-sm px-4 py-1.5 rounded-lg font-semibold hover:opacity-80 transition'
                                                    style={{ backgroundColor: '#2D5A40', color: '#C9A84C' }}
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRemove(tenant)}
                                                className='text-sm px-4 py-1.5 rounded-lg font-semibold hover:opacity-80 transition'
                                                style={{ backgroundColor: '#fff', color: '#dc2626', border: '1px solid #dc2626' }}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TenantsPage