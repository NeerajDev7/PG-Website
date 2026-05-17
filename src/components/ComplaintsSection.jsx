import { useSelector, useDispatch } from 'react-redux'
import { resolveComplaint, deleteComplaint } from '../store/tenantSlice'
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
    const complaints = useSelector((state) => state.tenants.complaints)

    const pending = complaints.filter(c => c.status === 'pending')
    const resolved = complaints.filter(c => c.status === 'resolved')

    const handleResolve = (id) => {
        dispatch(resolveComplaint(id))
        toast.success('Complaint marked as resolved!')
    }

    const handleDelete = (id) => {
        dispatch(deleteComplaint(id))
        toast.success('Complaint deleted')
    }

    if (complaints.length === 0) {
        return (
            <div
                className='rounded-xl p-10 shadow-sm flex flex-col items-center justify-center'
                style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
            >
                <p className='text-4xl mb-3'>🎉</p>
                <p className='font-semibold mb-1' style={{ color: '#1B3A2D' }}>No complaints yet</p>
                <p className='text-sm' style={{ color: '#6b7c74' }}>All tenants are happy!</p>
            </div>
        )
    }

    const ComplaintCard = ({ complaint }) => (
        <div
            className='rounded-lg p-4 mb-3'
            style={{ backgroundColor: '#F7F1E8', border: '1px solid #E8DFC8' }}
        >
            <div className='flex justify-between items-start gap-2 flex-wrap'>
                <div className='flex items-center gap-2'>
                    <span className='text-lg'>{CATEGORY_ICONS[complaint.category] || '📝'}</span>
                    <div>
                        <p className='text-sm font-bold' style={{ color: '#1B3A2D' }}>{complaint.tenantName}</p>
                        <p className='text-xs' style={{ color: '#6b7c74' }}>{complaint.room} · {complaint.createdAt}</p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <span
                        className='text-xs font-bold px-3 py-1 rounded-full'
                        style={{ backgroundColor: '#1B3A2D', color: '#C9A84C' }}
                    >
                        {complaint.category}
                    </span>
                    <span
                        className='text-xs font-bold px-3 py-1 rounded-full'
                        style={complaint.status === 'resolved'
                            ? { backgroundColor: '#2D5A40', color: '#C9A84C' }
                            : { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffc107' }
                        }
                    >
                        {complaint.status === 'resolved' ? '✅ Resolved' : '⏳ Pending'}
                    </span>
                </div>
            </div>

            <p className='text-sm mt-3 mb-4' style={{ color: '#1B3A2D' }}>{complaint.description}</p>

            <div className='flex gap-2 justify-end'>
                {complaint.status === 'pending' && (
                    <button
                        onClick={() => handleResolve(complaint.id)}
                        className='px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition'
                        style={{ backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }}
                    >
                        ✅ Mark Resolved
                    </button>
                )}
                <button
                    onClick={() => handleDelete(complaint.id)}
                    className='px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-80 transition'
                    style={{ backgroundColor: '#fff', color: '#dc2626', border: '1px solid #dc2626' }}
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
                <div className='rounded-xl px-5 py-4 shadow-sm' style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}>
                    <p className='text-xs font-semibold' style={{ color: '#6b7c74' }}>Resolved</p>
                    <p className='text-2xl font-bold' style={{ color: '#2D5A40' }}>{resolved.length}</p>
                </div>
                <div className='rounded-xl px-5 py-4 shadow-sm' style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}>
                    <p className='text-xs font-semibold' style={{ color: '#6b7c74' }}>Total</p>
                    <p className='text-2xl font-bold' style={{ color: '#1B3A2D' }}>{complaints.length}</p>
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
                    <h4 className='text-sm font-bold mb-3' style={{ color: '#2D5A40' }}>✅ Resolved ({resolved.length})</h4>
                    {resolved.slice().reverse().map(c => <ComplaintCard key={c.id} complaint={c} />)}
                </div>
            )}
        </div>
    )
}

export default ComplaintsSection