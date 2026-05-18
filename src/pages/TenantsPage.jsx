import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { markAsPaid, removeTenant } from '../store/tenantSlice'
import Sidebar from '../components/Sidebar'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'
import PageTransition from '../components/PageTransition'

function TenantsPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const tenants = useSelector((state) => state.tenants.tenants)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState({ open: false, tenant: null })

    const filtered = tenants.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.room.toLowerCase().includes(search.toLowerCase())
    )

    const handleRemoveClick = (tenant) => setModal({ open: true, tenant })

    const handleConfirmRemove = () => {
        dispatch(removeTenant(modal.tenant.id))
        toast.success(`${modal.tenant.name} removed`)
        setModal({ open: false, tenant: null })
    }

    return (
        <PageTransition>
            <div className='flex min-h-screen' style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <Sidebar />
                <div className='flex-1 p-4 md:p-8 mt-16 md:mt-0'>

                    <ConfirmModal
                        isOpen={modal.open}
                        title='Remove Tenant'
                        message={`Are you sure you want to remove ${modal.tenant?.name} from ${modal.tenant?.room}? This cannot be undone.`}
                        onConfirm={handleConfirmRemove}
                        onCancel={() => setModal({ open: false, tenant: null })}
                    />

                    <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6'>
                        <div>
                            <h1 className='text-2xl md:text-3xl font-bold' style={{ color: 'var(--text-primary)' }}>Tenants</h1>
                            <p className='mt-1 text-sm' style={{ color: 'var(--text-secondary)' }}>{tenants.length} active tenants</p>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-3'>
                            <input
                                type='text'
                                placeholder='Search by name or room...'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className='w-full sm:w-64 px-4 py-2 rounded-lg text-sm focus:outline-none'
                                style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                            />
                            <button
                                onClick={() => navigate('/add-tenant')}
                                className='px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm whitespace-nowrap'
                                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '2px solid var(--accent)' }}
                            >
                                + Add Tenant
                            </button>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className='flex flex-col gap-4 md:hidden'>
                        {filtered.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-16 rounded-xl' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                <p className='text-5xl mb-4'>🏠</p>
                                <p className='font-bold text-lg mb-1' style={{ color: 'var(--text-primary)' }}>No tenants found</p>
                                <p className='text-sm mb-6' style={{ color: 'var(--text-secondary)' }}>
                                    {search ? 'Try a different search' : 'Add your first tenant to get started'}
                                </p>
                                {!search && (
                                    <button
                                        onClick={() => navigate('/add-tenant')}
                                        className='px-6 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition'
                                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '2px solid var(--accent)' }}
                                    >
                                        + Add Tenant
                                    </button>
                                )}
                            </div>
                        ) : (
                            filtered.map((tenant) => (
                                <div
                                    key={tenant.id}
                                    className='rounded-xl p-5 shadow-sm'
                                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                                >
                                    <div className='flex justify-between items-start mb-3'>
                                        <div>
                                            <p
                                                className='font-bold text-lg cursor-pointer hover:underline'
                                                style={{ color: 'var(--text-primary)' }}
                                                onClick={() => navigate(`/tenant/${tenant.id}`)}
                                            >
                                                {tenant.name}
                                            </p>
                                            <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>{tenant.room}</p>
                                        </div>
                                        <span
                                            className='px-3 py-1 rounded-full text-xs font-bold'
                                            style={tenant.paid
                                                ? { backgroundColor: 'var(--paid-bg)', color: 'var(--paid-text)' }
                                                : { backgroundColor: 'var(--pending-bg)', color: 'var(--pending-text)', border: '1px solid var(--pending-border)' }
                                            }
                                        >
                                            {tenant.paid ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                    <p className='text-sm font-semibold mb-4' style={{ color: 'var(--text-primary)' }}>₹{tenant.rent}/month</p>
                                    <div className='flex gap-2'>
                                        {!tenant.paid && (
                                            <button
                                                onClick={() => { dispatch(markAsPaid(tenant.id)); toast.success(`${tenant.name} marked as paid!`) }}
                                                className='flex-1 py-2 rounded-lg font-semibold text-sm'
                                                style={{ backgroundColor: 'var(--paid-bg)', color: 'var(--paid-text)' }}
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRemoveClick(tenant)}
                                            className='flex-1 py-2 rounded-lg font-semibold text-sm'
                                            style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid var(--danger)' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop Table */}
                    <div className='hidden md:block rounded-xl overflow-hidden shadow-sm' style={{ border: '1px solid var(--border-color)' }}>
                        <table className='w-full'>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                                    <th className='text-left px-6 py-4 text-sm font-semibold' style={{ color: 'var(--accent)' }}>Name</th>
                                    <th className='text-left px-6 py-4 text-sm font-semibold' style={{ color: 'var(--accent)' }}>Room</th>
                                    <th className='text-left px-6 py-4 text-sm font-semibold' style={{ color: 'var(--accent)' }}>Rent</th>
                                    <th className='text-left px-6 py-4 text-sm font-semibold' style={{ color: 'var(--accent)' }}>Status</th>
                                    <th className='text-left px-6 py-4 text-sm font-semibold' style={{ color: 'var(--accent)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan='5'>
                                            <div className='flex flex-col items-center justify-center py-16'>
                                                <p className='text-5xl mb-4'>🏠</p>
                                                <p className='font-bold text-lg mb-1' style={{ color: 'var(--text-primary)' }}>No tenants found</p>
                                                <p className='text-sm mb-6' style={{ color: 'var(--text-secondary)' }}>
                                                    {search ? 'Try a different search' : 'Add your first tenant to get started'}
                                                </p>
                                                {!search && (
                                                    <button
                                                        onClick={() => navigate('/add-tenant')}
                                                        className='px-6 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition'
                                                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '2px solid var(--accent)' }}
                                                    >
                                                        + Add Tenant
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((tenant, index) => (
                                        <tr
                                            key={tenant.id}
                                            style={{
                                                backgroundColor: index % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-tertiary)',
                                                borderBottom: '1px solid var(--border-subtle)'
                                            }}
                                        >
                                            <td
                                                className='px-6 py-4 font-medium cursor-pointer hover:underline'
                                                style={{ color: 'var(--text-primary)' }}
                                                onClick={() => navigate(`/tenant/${tenant.id}`)}
                                            >
                                                {tenant.name}
                                            </td>
                                            <td className='px-6 py-4' style={{ color: 'var(--text-secondary)' }}>{tenant.room}</td>
                                            <td className='px-6 py-4 font-medium' style={{ color: 'var(--text-primary)' }}>₹{tenant.rent}</td>
                                            <td className='px-6 py-4'>
                                                <span
                                                    className='px-3 py-1 rounded-full text-xs font-bold'
                                                    style={tenant.paid
                                                        ? { backgroundColor: 'var(--paid-bg)', color: 'var(--paid-text)' }
                                                        : { backgroundColor: 'var(--pending-bg)', color: 'var(--pending-text)', border: '1px solid var(--pending-border)' }
                                                    }
                                                >
                                                    {tenant.paid ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 flex gap-2'>
                                                {!tenant.paid && (
                                                    <button
                                                        onClick={() => { dispatch(markAsPaid(tenant.id)); toast.success(`${tenant.name} marked as paid!`) }}
                                                        className='text-sm px-4 py-1.5 rounded-lg font-semibold hover:opacity-80 transition'
                                                        style={{ backgroundColor: 'var(--paid-bg)', color: 'var(--paid-text)' }}
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveClick(tenant)}
                                                    className='text-sm px-4 py-1.5 rounded-lg font-semibold hover:opacity-80 transition'
                                                    style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid var(--danger)' }}
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
        </PageTransition>
    )
}

export default TenantsPage