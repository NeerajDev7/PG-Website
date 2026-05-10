import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addTenant } from '../store/tenantSlice'
import Sidebar from '../components/Sidebar'

function AddTenantPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', room: '', rent: '' })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = () => {
        if (!form.name || !form.room || !form.rent) return

        dispatch(addTenant({
            id: Date.now(),
            name: form.name,
            room: form.room,
            rent: Number(form.rent),
            paid: false
        }))

        navigate('/tenants')
    }

    return (
        <div className='flex min-h-screen' style={{ backgroundColor: '#F7F1E8' }}>
            <Sidebar />
            <div className='flex-1 p-8'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold' style={{ color: '#1B3A2D' }}>Add Tenant</h1>
                    <p className='mt-1' style={{ color: '#6b7c74' }}>Fill in the details below</p>
                </div>

                <div
                    className='rounded-2xl p-10 shadow-sm max-w-lg'
                    style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                >
                    <div className='mb-6'>
                        <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>Full Name</label>
                        <input
                            name='name'
                            value={form.name}
                            onChange={handleChange}
                            placeholder='Paul Allen'
                            className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none'
                            style={{ border: '1px solid #C9A84C', backgroundColor: '#F7F1E8', color: '#1B3A2D' }}
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>Room</label>
                        <input
                            name='room'
                            value={form.room}
                            onChange={handleChange}
                            placeholder='Room 101'
                            className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none'
                            style={{ border: '1px solid #C9A84C', backgroundColor: '#F7F1E8', color: '#1B3A2D' }}
                        />
                    </div>

                    <div className='mb-10'>
                        <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>Monthly Rent (₹)</label>
                        <input
                            name='rent'
                            value={form.rent}
                            onChange={handleChange}
                            placeholder='12000'
                            className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none'
                            style={{ border: '1px solid #C9A84C', backgroundColor: '#F7F1E8', color: '#1B3A2D' }}
                        />
                    </div>

                    <div className='flex gap-3'>
                        <button
                            onClick={() => navigate('/tenants')}
                            className='flex-1 py-3 rounded-lg font-semibold hover:opacity-80 transition'
                            style={{ backgroundColor: '#F7F1E8', color: '#1B3A2D', border: '1px solid #C9A84C' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className='flex-1 py-3 rounded-lg font-bold hover:opacity-90 transition'
                            style={{ backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }}
                        >
                            Add Tenant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddTenantPage