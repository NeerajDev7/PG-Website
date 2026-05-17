import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { updateTenant, addComplaint } from '../store/tenantSlice'
import toast from 'react-hot-toast'

const CATEGORIES = ['Maintenance', 'Noise', 'Cleanliness', 'Food', 'Other']

function TenantDashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
   const tenants = useSelector((state) => state.tenants.tenants ?? [])
const rooms = useSelector((state) => state.tenants.rooms ?? [])
const complaints = useSelector((state) => state.tenants.complaints ?? [])

    const tenantId = Number(sessionStorage.getItem('tenant-id'))
    const tenant = tenants.find(t => t.id === tenantId)
    const room = rooms.find(r => r.number === tenant?.room?.replace('Room ', ''))

    const myComplaints = complaints.filter(c => c.tenantId === tenantId)

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

    const [complaintForm, setComplaintForm] = useState({
        category: '',
        description: '',
    })
    const [complaintErrors, setComplaintErrors] = useState({})

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

    const handleLogout = () => {
        sessionStorage.removeItem('tenant-auth')
        sessionStorage.removeItem('tenant-id')
        navigate('/')
    }

    const validateComplaint = () => {
        const errors = {}
        if (!complaintForm.category) errors.category = 'Please select a category'
        if (!complaintForm.description.trim()) errors.description = 'Please describe the issue'
        else if (complaintForm.description.trim().length < 10) errors.description = 'Description too short, add more detail'
        return errors
    }

    const handleComplaintSubmit = () => {
        const errors = validateComplaint()
        if (Object.keys(errors).length > 0) {
            setComplaintErrors(errors)
            return
        }

        dispatch(addComplaint({
            tenantId: tenant.id,
            tenantName: tenant.name,
            room: tenant.room,
            category: complaintForm.category,
            description: complaintForm.description.trim(),
        }))

        toast.success('Complaint submitted!')
        setComplaintForm({ category: '', description: '' })
        setComplaintErrors({})
    }

    if (!tenant) {
        return (
            <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: '#F7F1E8' }}>
                <p style={{ color: '#1B3A2D' }}>Tenant not found. Please login again.</p>
            </div>
        )
    }

    return (
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
                        style={{ border: '1px solid #dc2626', backgroundColor: '#dc2626', color: '#ffffff' }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className='max-w-4xl mx-auto p-6 md:p-10'>

                {/* Welcome */}
                <div className='flex justify-between items-start mb-8'>
                    <div>
                        <h2 className='text-2xl md:text-3xl font-bold' style={{ color: '#1B3A2D' }}>
                            Welcome, {tenant.name} 🏠
                        </h2>
                        <p className='mt-1 text-sm' style={{ color: '#6b7c74' }}>Here's your stay summary</p>
                    </div>
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className='px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition'
                            style={{ backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }}
                        >
                            ✏️ Edit Profile
                        </button>
                    )}
                </div>

                {/* Status Cards */}
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
                    <div className='rounded-xl p-5 shadow-sm' style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}>
                        <p className='text-xs mb-1' style={{ color: '#6b7c74' }}>Your Room</p>
                        <p className='text-2xl font-bold' style={{ color: '#1B3A2D' }}>{tenant.room}</p>
                    </div>
                    <div className='rounded-xl p-5 shadow-sm' style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}>
                        <p className='text-xs mb-1' style={{ color: '#6b7c74' }}>Monthly Rent</p>
                        <p className='text-2xl font-bold' style={{ color: '#C9A84C' }}>₹{tenant.rent}</p>
                    </div>
                    <div className='col-span-2 md:col-span-1 rounded-xl p-5 shadow-sm' style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}>
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

                {/* Edit Profile Form */}
                {editing && (
                    <div className='rounded-xl p-6 shadow-sm mb-6' style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}>
                        <div className='flex justify-between items-center mb-6'>
                            <h3 className='font-bold text-lg' style={{ color: '#1B3A2D' }}>Edit Profile</h3>
                            <div className='flex gap-2'>
                                <button
                                    onClick={() => setEditing(false)}
                                    className='px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition'
                                    style={{ backgroundColor: '#F7F1E8', color: '#1B3A2D', border: '1px solid #C9A84C' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className='px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition'
                                    style={{ backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                            {[
                                { label: 'Phone', key: 'phone', placeholder: '9876543210' },
                                { label: 'Email', key: 'email', placeholder: 'email@gmail.com' },
                                { label: 'Hometown', key: 'hometown', placeholder: 'Chennai, Tamil Nadu' },
                                { label: 'Address', key: 'address', placeholder: 'Current address' },
                            ].map((field) => (
                                <div key={field.key}>
                                    <label className='block text-xs font-semibold mb-1' style={{ color: '#6b7c74' }}>{field.label}</label>
                                    <input
                                        value={editForm[field.key]}
                                        onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                                        placeholder={field.placeholder}
                                        className='w-full px-3 py-2 rounded-lg text-sm focus:outline-none'
                                        style={{ border: '1px solid #C9A84C', backgroundColor: '#F7F1E8', color: '#1B3A2D' }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className='mb-4'>
                            <label className='block text-xs font-semibold mb-2' style={{ color: '#6b7c74' }}>Meal Preference</label>
                            <div className='flex gap-3'>
                                {['vegetarian', 'non-vegetarian'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setEditForm({ ...editForm, mealType: type })}
                                        className='flex-1 py-2 rounded-lg text-sm font-semibold transition'
                                        style={editForm.mealType === type
                                            ? { backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }
                                            : { backgroundColor: '#F7F1E8', color: '#1B3A2D', border: '1px solid #C9A84C' }
                                        }
                                    >
                                        {type === 'vegetarian' ? '🥦 Vegetarian' : '🍖 Non-Vegetarian'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #F0EAD8', paddingTop: '16px' }}>
                            <p className='text-sm font-bold mb-3' style={{ color: '#1B3A2D' }}>Emergency Contact</p>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {[
                                    { label: 'Name', key: 'emergencyName' },
                                    { label: 'Phone', key: 'emergencyPhone' },
                                    { label: 'Relation', key: 'emergencyRelation' },
                                ].map((field) => (
                                    <div key={field.key}>
                                        <label className='block text-xs font-semibold mb-1' style={{ color: '#6b7c74' }}>{field.label}</label>
                                        <input
                                            value={editForm[field.key]}
                                            onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                                            className='w-full px-3 py-2 rounded-lg text-sm focus:outline-none'
                                            style={{ border: '1px solid #C9A84C', backgroundColor: '#F7F1E8', color: '#1B3A2D' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Personal Info — Read view */}
                {!editing && (
                    <div className='rounded-xl p-6 shadow-sm mb-6' style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}>
                        <h3 className='font-bold text-lg mb-4' style={{ color: '#1B3A2D' }}>My Details</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {[
                                { label: 'Phone', value: tenant.phone || '—' },
                                { label: 'Email', value: tenant.email || '—' },
                                { label: 'Hometown', value: tenant.hometown || '—' },
                                { label: 'Address', value: tenant.address || '—' },
                                { label: 'Meal Preference', value: tenant.mealType === 'vegetarian' ? '🥦 Vegetarian' : tenant.mealType === 'non-vegetarian' ? '🍖 Non-Vegetarian' : '—' },
                                { label: 'Emergency Contact', value: tenant.emergencyContact?.name ? `${tenant.emergencyContact.name} (${tenant.emergencyContact.relation}) — ${tenant.emergencyContact.phone}` : '—' },
                            ].map((item) => (
                                <div key={item.label} style={{ borderBottom: '1px solid #F0EAD8', paddingBottom: '12px' }}>
                                    <p className='text-xs mb-1' style={{ color: '#6b7c74' }}>{item.label}</p>
                                    <p className='font-medium text-sm' style={{ color: '#1B3A2D' }}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Room Details */}
                <div className='rounded-xl p-6 shadow-sm mb-6' style={{ backgroundColor: '#1B3A2D', border: '1px solid #C9A84C' }}>
                    <h3 className='font-bold text-lg mb-4' style={{ color: '#C9A84C' }}>Room Details</h3>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {[
                            { label: 'Room', value: tenant.room },
                            { label: 'Type', value: room?.type || '—' },
                            { label: 'Monthly Rent', value: '₹' + tenant.rent },
                            { label: 'Status', value: 'Active' },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className='text-xs mb-1' style={{ color: '#a0b8a8' }}>{item.label}</p>
                                <p className='font-semibold text-sm' style={{ color: item.label === 'Monthly Rent' ? '#C9A84C' : '#F7F1E8' }}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rent History */}
                <div className='rounded-xl p-6 shadow-sm mb-6' style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}>
                    <h3 className='font-bold text-lg mb-4' style={{ color: '#1B3A2D' }}>Rent History</h3>
                    {tenant.rentHistory && tenant.rentHistory.length > 0 ? (
                        <table className='w-full'>
                            <thead>
                                <tr style={{ backgroundColor: '#1B3A2D' }}>
                                    <th className='text-left px-4 py-3 text-xs font-semibold' style={{ color: '#C9A84C' }}>Month</th>
                                    <th className='text-left px-4 py-3 text-xs font-semibold' style={{ color: '#C9A84C' }}>Date</th>
                                    <th className='text-left px-4 py-3 text-xs font-semibold' style={{ color: '#C9A84C' }}>Amount</th>
                                    <th className='text-left px-4 py-3 text-xs font-semibold' style={{ color: '#C9A84C' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenant.rentHistory.map((entry, index) => (
                                    <tr
                                        key={index}
                                        style={{
                                            backgroundColor: index % 2 === 0 ? '#fff' : '#F7F1E8',
                                            borderBottom: '1px solid #E8DFC8'
                                        }}
                                    >
                                        <td className='px-4 py-3 text-sm' style={{ color: '#1B3A2D' }}>{entry.month}</td>
                                        <td className='px-4 py-3 text-sm' style={{ color: '#6b7c74' }}>{entry.date}</td>
                                        <td className='px-4 py-3 text-sm font-semibold' style={{ color: '#C9A84C' }}>{'₹' + entry.amount}</td>
                                        <td className='px-4 py-3'>
                                            <span className='text-xs font-bold px-2 py-1 rounded-full' style={{ backgroundColor: '#2D5A40', color: '#C9A84C' }}>
                                                Paid
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-10'>
                            <p className='text-4xl mb-3'>📋</p>
                            <p className='font-semibold mb-1' style={{ color: '#1B3A2D' }}>No payment history yet</p>
                            <p className='text-sm' style={{ color: '#6b7c74' }}>History will appear once rent is marked as paid</p>
                        </div>
                    )}
                </div>

                {/* ── Complaint Form ── */}
                <div className='rounded-xl p-6 shadow-sm mb-6' style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}>
                    <h3 className='font-bold text-lg mb-1' style={{ color: '#1B3A2D' }}>Raise a Complaint</h3>
                    <p className='text-xs mb-5' style={{ color: '#6b7c74' }}>Let us know about any issue and we'll get it sorted</p>

                    {/* Category Pills */}
                    <div className='mb-4'>
                        <label className='block text-xs font-semibold mb-2' style={{ color: '#6b7c74' }}>Category *</label>
                        <div className='flex flex-wrap gap-2'>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    type='button'
                                    onClick={() => {
                                        setComplaintForm({ ...complaintForm, category: cat })
                                        setComplaintErrors({ ...complaintErrors, category: '' })
                                    }}
                                    className='px-4 py-2 rounded-full text-xs font-semibold transition'
                                    style={complaintForm.category === cat
                                        ? { backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }
                                        : { backgroundColor: '#F7F1E8', color: '#1B3A2D', border: '1px solid #C9A84C' }
                                    }
                                >
                                    {cat === 'Maintenance' && '🔧 '}
                                    {cat === 'Noise' && '🔊 '}
                                    {cat === 'Cleanliness' && '🧹 '}
                                    {cat === 'Food' && '🍽️ '}
                                    {cat === 'Other' && '📝 '}
                                    {cat}
                                </button>
                            ))}
                        </div>
                        {complaintErrors.category && (
                            <p className='text-xs mt-1' style={{ color: '#dc2626' }}>{complaintErrors.category}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className='mb-5'>
                        <label className='block text-xs font-semibold mb-2' style={{ color: '#6b7c74' }}>Describe the issue *</label>
                        <textarea
                            value={complaintForm.description}
                            onChange={(e) => {
                                setComplaintForm({ ...complaintForm, description: e.target.value })
                                setComplaintErrors({ ...complaintErrors, description: '' })
                            }}
                            placeholder='e.g. The bathroom tap has been leaking since 2 days, water is wasting...'
                            rows={4}
                            className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none resize-none'
                            style={{
                                border: complaintErrors.description ? '1px solid #dc2626' : '1px solid #C9A84C',
                                backgroundColor: '#F7F1E8',
                                color: '#1B3A2D'
                            }}
                        />
                        {complaintErrors.description && (
                            <p className='text-xs mt-1' style={{ color: '#dc2626' }}>{complaintErrors.description}</p>
                        )}
                    </div>

                    <button
                        onClick={handleComplaintSubmit}
                        className='w-full py-3 rounded-lg font-bold text-sm hover:opacity-90 transition'
                        style={{ backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }}
                    >
                        Submit Complaint
                    </button>
                </div>

                {/* My Complaints History */}
                {myComplaints.length > 0 && (
                    <div className='rounded-xl p-6 shadow-sm mb-6' style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}>
                        <h3 className='font-bold text-lg mb-4' style={{ color: '#1B3A2D' }}>My Complaints</h3>
                        <div className='flex flex-col gap-3'>
                            {myComplaints.slice().reverse().map((c) => (
                                <div
                                    key={c.id}
                                    className='rounded-lg p-4'
                                    style={{ backgroundColor: '#F7F1E8', border: '1px solid #E8DFC8' }}
                                >
                                    <div className='flex justify-between items-start mb-2'>
                                        <span
                                            className='text-xs font-bold px-3 py-1 rounded-full'
                                            style={{ backgroundColor: '#1B3A2D', color: '#C9A84C' }}
                                        >
                                            {c.category}
                                        </span>
                                        <span
                                            className='text-xs font-bold px-3 py-1 rounded-full'
                                            style={c.status === 'resolved'
                                                ? { backgroundColor: '#2D5A40', color: '#C9A84C' }
                                                : { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffc107' }
                                            }
                                        >
                                            {c.status === 'resolved' ? '✅ Resolved' : '⏳ Pending'}
                                        </span>
                                    </div>
                                    <p className='text-sm mt-2' style={{ color: '#1B3A2D' }}>{c.description}</p>
                                    <p className='text-xs mt-2' style={{ color: '#6b7c74' }}>Submitted on {c.createdAt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PG Info */}
                <div className='rounded-xl p-6 shadow-sm' style={{ backgroundColor: '#1B3A2D', border: '1px solid #C9A84C' }}>
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
    )
}

export default TenantDashboard