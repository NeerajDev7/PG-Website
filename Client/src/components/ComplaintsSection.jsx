import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resolveComplaint, deleteComplaint, setComplaints } from '../store/tenantSlice'
import toast from 'react-hot-toast'

const CATEGORY_ICONS = {
    Maintenance: '🔧',
    Noise: '🔊',
    Cleanliness: '🧹',
    Food: '🍽️',
    Other: '📝',
}

function ComplaintsSection() {
    const dispatch = useDispatch()
    const complaints = useSelector((state) => state.tenants.complaints ?? [])

    useEffect(() => {
        fetch('https://pg-manager-backend-mryl.onrender.com/api/complaints')
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(c => ({
                    id: c.id,
                    tenantId: c.tenant_id,
                    tenantName: c.tenant_name,
                    room: c.room,
                    category: c.category,
                    description: c.description,
                    status: c.status,
                    createdAt: c.created_at,
                }))
                dispatch(setComplaints(formatted))
            })
            .catch(err => console.error('Failed to fetch complaints:', err))
    }, [])

    const pending = complaints.filter(c => c.status === 'pending')
    const resolved = complaints.filter(c => c.status === 'resolved')

    const handleResolve = (id) => {
        fetch(`https://pg-manager-backend-mryl.onrender.com/api/complaints/${id}/resolve`, {
            method: 'PATCH',
        })
            .then(res => res.json())
            .then(() => {
                dispatch(resolveComplaint(id))
                toast.success('Complaint marked as resolved!')
            })
            .catch(err => {
                console.error('Failed to resolve complaint:', err)
                toast.error('Failed to resolve complaint')
            })
    }

    const handleDelete = (id) => {
        fetch(`https://pg-manager-backend-mryl.onrender.com/api/complaints/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(() => {
                dispatch(deleteComplaint(id))
                toast.success('Complaint deleted')
            })
            .catch(err => {
                console.error('Failed to delete complaint:', err)
                toast.error('Failed to delete complaint')
            })
    }

    if (complaints.length === 0) {
        return (
            <div
                className='rounded-xl p-10 shadow-sm flex flex-col items-center justify-center'
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
                <p className='text-4xl mb-3'>🎉</p>
                <p className='font-semibold mb-1' style={{ color: 'var(--text-primary)' }}>No complaints yet</p>
                <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>All tenants are happy!</p>
            </div>
        )
    }

    const ComplaintCard = ({ complaint }) => (
        <div
            className='rounded-lg p-4 mb-3'
            style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}
        >
            <div className='flex justify-between items-start gap-2 flex-wrap'>
                <div className='flex items-center gap-2'>
                    <span className='text-lg'>{CATEGORY_ICONS[complaint.category] || '📝'}</span>
                    <div>
                        <p className='text-sm font-bold' style={{ color: 'var(--text-primary)' }}>{complaint.tenantName}</p>
                        <p className='text-xs' style={{ color: 'var(--text-secondary)' }}>{complaint.room} · {complaint.createdAt}</p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <span
                        className='text-xs font-bold px-3 py-1 rounded-full'
                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)' }}
                    >
                        {complaint.category}
                    </span>
                    <span
                        className='text-xs font-bold px-3 py-1 rounded-full'
                        style={complaint.status === 'resolved'
                            ? { backgroundColor: 'var(--bg-secondary)', color: 'var(--accent)' }
                            : { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffc107' }
                        }
                    >
                        {complaint.status === 'resolved' ? '✅ Resolved' : '⏳ Pending'}
                    </span>
                </div>
            </div>

            <p className='text-sm mt-3 mb-4' style={{ color: 'var(--text-primary)' }}>{complaint.description}</p>

            <div className='flex gap-2 justify-end'>
                {complaint.status === 'pending' && (
                    <button
                        onClick={() => handleResolve(complaint.id)}
                        className='px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition'
                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '2px solid var(--border-color)' }}
                    >
                        ✅ Mark Resolved
                    </button>
                )}
                <button
                    onClick={() => handleDelete(complaint.id)}
                    className='px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-80 transition'
                    style={{ backgroundColor: 'var(--bg-card)', color: '#dc2626', border: '1px solid var(--danger)' }}
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    )

    return (
        <div>
            {/* Summary bar */}
            <div className='flex gap-4 mb-6'>
                <div className='rounded-xl px-5 py-4 shadow-sm' style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
                    <p className='text-xs font-semibold' style={{ color: '#856404' }}>Pending</p>
                    <p className='text-2xl font-bold' style={{ color: '#856404' }}>{pending.length}</p>
                </div>
                <div className='rounded-xl px-5 py-4 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <p className='text-xs font-semibold' style={{ color: 'var(--text-secondary)' }}>Resolved</p>
                    <p className='text-2xl font-bold' style={{ color: 'var(--bg-secondary)' }}>{resolved.length}</p>
                </div>
                <div className='rounded-xl px-5 py-4 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <p className='text-xs font-semibold' style={{ color: 'var(--text-secondary)' }}>Total</p>
                    <p className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>{complaints.length}</p>
                </div>
            </div>

            {/* Pending complaints */}
            {pending.length > 0 && (
                <div className='mb-6'>
                    <h4 className='text-sm font-bold mb-3' style={{ color: '#856404' }}>⏳ Pending ({pending.length})</h4>
                    {pending.slice().reverse().map(c => <ComplaintCard key={c.id} complaint={c} />)}
                </div>
            )}

            {/* Resolved complaints */}
            {resolved.length > 0 && (
                <div>
                    <h4 className='text-sm font-bold mb-3' style={{ color: 'var(--bg-secondary)' }}>✅ Resolved ({resolved.length})</h4>
                    {resolved.slice().reverse().map(c => <ComplaintCard key={c.id} complaint={c} />)}
                </div>
            )}
        </div>
    )
}

export default ComplaintsSection