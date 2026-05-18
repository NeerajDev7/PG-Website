import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { updateTenant } from '../store/tenantSlice'
import Sidebar from '../components/Sidebar'
import PageTransition from '../components/PageTransition'
import toast from 'react-hot-toast'

function TenantProfilePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const tenants = useSelector((state) => state.tenants.tenants ?? [])
    const rooms = useSelector((state) => state.tenants.rooms ?? [])

    const tenant = tenants.find(t => String(t.id) === String(id))
    const room = rooms.find(r => r.number === tenant?.room?.replace('Room ', ''))

    const [editing, setEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        phone: tenant?.phone || '',
        email: tenant?.email || '',
        hometown: tenant?.hometown || '',
        address: tenant?.address || '',
        mealType: tenant?.mealType || 'vegetarian',
        emergencyName: tenant?.emergencyContact?.name || '',
        emergencyPhone: tenant?.emergencyContact?.phone || '',
        emergencyRelation: tenant?.emergencyContact?.relation || '',
    })

    const handleSave = () => {
        dispatch(updateTenant({
            id: tenant.id,
            phone: editForm.phone,
            email: editForm.email,
            hometown: editForm.hometown,
            address: editForm.address,
            mealType: editForm.mealType,
            emergencyContact: {
                name: editForm.emergencyName,
                phone: editForm.emergencyPhone,
                relation: editForm.emergencyRelation,
            }
        }))
        toast.success('Profile updated!')
        setEditing(false)
    }

    if (!tenant) {
        return (
            <PageTransition>
                <div className='flex min-h-screen' style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <Sidebar />
                    <div className='flex-1 flex items-center justify-center'>
                        <div className='text-center'>
                            <p className='text-5xl mb-4'>🔍</p>
                            <p className='font-bold text-lg mb-2' style={{ color: 'var(--text-primary)' }}>Tenant not found</p>
                            <button
                                onClick={() => navigate('/tenants')}
                                className='mt-4 px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition'
                                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '2px solid var(--border-color)' }}
                            >
                                ← Back to Tenants
                            </button>
                        </div>
                    </div>
                </div>
            </PageTransition>
        )
    }

    return (
        <PageTransition>
            <div className='flex min-h-screen' style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <Sidebar />
                <div className='flex-1 p-4 md:p-8 mt-16 md:mt-0'>

                    {/* Header */}
                    <div className='flex justify-between items-center mb-6'>
                        <div>
                            <h1 className='text-2xl md:text-3xl font-bold' style={{ color: 'var(--text-primary)' }}>{tenant.name}</h1>
                            <p className='mt-1 text-sm' style={{ color: 'var(--text-secondary)' }}>{tenant.room} · {tenant.mealType === 'vegetarian' ? '🥦 Vegetarian' : '🍖 Non-Vegetarian'}</p>
                        </div>
                        <div className='flex gap-3'>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className='px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition'
                                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '2px solid var(--border-color)' }}
                                >
                                    ✏️ Edit
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/tenants')}
                                className='px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition'
                                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                            >
                                ← Back
                            </button>
                        </div>
                    </div>

                    {/* Status Cards */}
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                        <div className='rounded-xl p-5 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <p className='text-xs mb-1' style={{ color: 'var(--text-secondary)' }}>Room</p>
                            <p className='text-xl font-bold' style={{ color: 'var(--text-primary)' }}>{tenant.room}</p>
                        </div>
                        <div className='rounded-xl p-5 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <p className='text-xs mb-1' style={{ color: 'var(--text-secondary)' }}>Monthly Rent</p>
                            <p className='text-xl font-bold' style={{ color: 'var(--accent)' }}>₹{tenant.rent}</p>
                        </div>
                        <div className='rounded-xl p-5 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <p className='text-xs mb-1' style={{ color: 'var(--text-secondary)' }}>Room Type</p>
                            <p className='text-xl font-bold' style={{ color: 'var(--text-primary)' }}>{room?.type || '—'}</p>
                        </div>
                        <div className='rounded-xl p-5 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <p className='text-xs mb-1' style={{ color: 'var(--text-secondary)' }}>Rent Status</p>
                            <span className='text-sm font-bold px-3 py-1 rounded-full'
                                style={tenant.paid
                                    ? { backgroundColor: 'var(--paid-bg)', color: 'var(--paid-text)' }
                                    : { backgroundColor: 'var(--pending-bg)', color: 'var(--pending-text)', border: '1px solid var(--pending-border)' }
                                }>
                                {tenant.paid ? '✅ Paid' : '⚠️ Pending'}
                            </span>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

                        {/* Personal Info / Edit Form */}
                        <div className='rounded-xl p-6 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <h3 className='font-bold text-lg mb-4' style={{ color: 'var(--text-primary)' }}>
                                {editing ? 'Edit Profile' : 'Personal Details'}
                            </h3>

                            {editing ? (
                                <>
                                    <div className='flex flex-col gap-3 mb-4'>
                                        {[
                                            { label: 'Phone', key: 'phone', placeholder: '9876543210' },
                                            { label: 'Email', key: 'email', placeholder: 'email@gmail.com' },
                                            { label: 'Hometown', key: 'hometown', placeholder: 'Chennai, Tamil Nadu' },
                                            { label: 'Address', key: 'address', placeholder: 'Current address' },
                                        ].map((field) => (
                                            <div key={field.key}>
                                                <label className='block text-xs font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>{field.label}</label>
                                                <input
                                                    value={editForm[field.key]}
                                                    onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className='w-full px-3 py-2 rounded-lg text-sm focus:outline-none'
                                                    style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className='mb-4'>
                                        <label className='block text-xs font-semibold mb-2' style={{ color: 'var(--text-secondary)' }}>Meal Preference</label>
                                        <div className='flex gap-3'>
                                            {['vegetarian', 'non-vegetarian'].map((type) => (
                                                <button key={type} onClick={() => setEditForm({ ...editForm, mealType: type })}
                                                    className='flex-1 py-2 rounded-lg text-sm font-semibold transition'
                                                    style={editForm.mealType === type
                                                        ? { backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '2px solid var(--border-color)' }
                                                        : { backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }
                                                    }>
                                                    {type === 'vegetarian' ? '🥦 Vegetarian' : '🍖 Non-Vegetarian'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='flex gap-2'>
                                        <button onClick={() => setEditing(false)}
                                            className='flex-1 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition'
                                            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                                            Cancel
                                        </button>
                                        <button onClick={handleSave}
                                            className='flex-1 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition'
                                            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '2px solid var(--border-color)' }}>
                                            Save Changes
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className='flex flex-col gap-3'>
                                    {[
                                        { label: 'Phone', value: tenant.phone || '—' },
                                        { label: 'Email', value: tenant.email || '—' },
                                        { label: 'Hometown', value: tenant.hometown || '—' },
                                        { label: 'Address', value: tenant.address || '—' },
                                        { label: 'Meal Preference', value: tenant.mealType === 'vegetarian' ? '🥦 Vegetarian' : tenant.mealType === 'non-vegetarian' ? '🍖 Non-Vegetarian' : '—' },
                                    ].map((item) => (
                                        <div key={item.label} style={{ borderBottom: '1px solid var(--divider)', paddingBottom: '10px' }}>
                                            <p className='text-xs mb-1' style={{ color: 'var(--text-secondary)' }}>{item.label}</p>
                                            <p className='font-medium text-sm' style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Emergency Contact + Rent History */}
                        <div className='flex flex-col gap-6'>

                            {/* Emergency Contact */}
                            <div className='rounded-xl p-6 shadow-sm' style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                                <h3 className='font-bold text-lg mb-4' style={{ color: 'var(--accent)' }}>Emergency Contact</h3>
                                {editing ? (
                                    <div className='grid grid-cols-1 gap-3'>
                                        {[
                                            { label: 'Name', key: 'emergencyName' },
                                            { label: 'Phone', key: 'emergencyPhone' },
                                            { label: 'Relation', key: 'emergencyRelation' },
                                        ].map((field) => (
                                            <div key={field.key}>
                                                <label className='block text-xs font-semibold mb-1' style={{ color: 'var(--text-muted)' }}>{field.label}</label>
                                                <input
                                                    value={editForm[field.key]}
                                                    onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                                                    className='w-full px-3 py-2 rounded-lg text-sm focus:outline-none'
                                                    style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-light)' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='flex flex-col gap-3'>
                                        {[
                                            { label: 'Name', value: tenant.emergencyContact?.name || '—' },
                                            { label: 'Phone', value: tenant.emergencyContact?.phone || '—' },
                                            { label: 'Relation', value: tenant.emergencyContact?.relation || '—' },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <p className='text-xs mb-1' style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                                                <p className='font-medium text-sm' style={{ color: 'var(--text-light)' }}>{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Rent History */}
                            <div className='rounded-xl p-6 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                <h3 className='font-bold text-lg mb-4' style={{ color: 'var(--text-primary)' }}>Rent History</h3>
                                {tenant.rentHistory && tenant.rentHistory.length > 0 ? (
                                    <table className='w-full'>
                                        <thead>
                                            <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                                                <th className='text-left px-3 py-2 text-xs font-semibold' style={{ color: 'var(--accent)' }}>Month</th>
                                                <th className='text-left px-3 py-2 text-xs font-semibold' style={{ color: 'var(--accent)' }}>Amount</th>
                                                <th className='text-left px-3 py-2 text-xs font-semibold' style={{ color: 'var(--accent)' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tenant.rentHistory.map((entry, index) => (
                                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-input)', borderBottom: '1px solid var(--border-subtle)' }}>
                                                    <td className='px-3 py-2 text-sm' style={{ color: 'var(--text-primary)' }}>{entry.month}</td>
                                                    <td className='px-3 py-2 text-sm font-semibold' style={{ color: 'var(--accent)' }}>₹{entry.amount}</td>
                                                    <td className='px-3 py-2'>
                                                        <span className='text-xs font-bold px-2 py-1 rounded-full' style={{ backgroundColor: 'var(--paid-bg)', color: 'var(--paid-text)' }}>Paid</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className='flex flex-col items-center justify-center py-8'>
                                        <p className='text-3xl mb-2'>📋</p>
                                        <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>No payment history yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}

export default TenantProfilePage