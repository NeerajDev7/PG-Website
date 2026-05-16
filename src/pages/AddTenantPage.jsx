import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addTenant } from '../store/tenantSlice'
import Sidebar from '../components/Sidebar'
import toast from 'react-hot-toast'
import PageTransition from '../components/PageTransition'

function AddTenantPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const tenants = useSelector((state) => state.tenants.tenants)
    const rooms = useSelector((state) => state.tenants.rooms)

    const [form, setForm] = useState({ name: '', room: '', rent: '' })
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const validate = () => {
        const newErrors = {}

        if (!form.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!form.room.trim()) {
            newErrors.room = 'Room is required'
        } else {
            const roomNumber = form.room.replace(/\D/g, '')
            const roomExists = rooms.find(r => r.number === roomNumber)
            if (!roomExists) {
                newErrors.room = `Room ${roomNumber} doesn't exist`
            } else {
                const alreadyOccupied = tenants.find(t => t.room === `Room ${roomNumber}`)
                if (alreadyOccupied) {
                    newErrors.room = `Room ${roomNumber} is already occupied by ${alreadyOccupied.name}`
                }
            }
        }

        if (!form.rent.trim()) {
            newErrors.rent = 'Rent is required'
        } else if (isNaN(form.rent) || Number(form.rent) <= 0) {
            newErrors.rent = 'Enter a valid rent amount'
        }

        return newErrors
    }

    const handleSubmit = () => {
        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error('Please fix the errors before submitting')
            return
        }

        const roomNumber = form.room.replace(/\D/g, '')

        dispatch(addTenant({
            id: Date.now(),
            name: form.name,
            room: `Room ${roomNumber}`,
            rent: Number(form.rent),
            paid: false,
            phone: '',
            email: '',
            hometown: '',
            address: '',
            emergencyContact: { name: '', phone: '', relation: '' },
            rentHistory: [],
            documents: []
        }))

        toast.success(`${form.name} added successfully!`)
        navigate('/tenants')
    }

    return (
        <PageTransition>
        <div className='flex min-h-screen' style={{ backgroundColor: '#F7F1E8' }}>
            <Sidebar />
            <div className='flex-1 p-4 md:p-8 mt-16 md:mt-0'>
                <div className='mb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold' style={{ color: '#1B3A2D' }}>Add Tenant</h1>
                    <p className='mt-1 text-sm' style={{ color: '#6b7c74' }}>Fill in the details below</p>
                </div>

                <div
                    className='rounded-2xl p-6 md:p-10 shadow-sm w-full max-w-lg'
                    style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                >
                    {/* Name */}
                    <div className='mb-5'>
                        <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>Full Name</label>
                        <input
                            name='name'
                            value={form.name}
                            onChange={handleChange}
                            placeholder='Paul Allen'
                            className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none'
                            style={{
                                border: errors.name ? '1px solid #dc2626' : '1px solid #C9A84C',
                                backgroundColor: '#F7F1E8',
                                color: '#1B3A2D'
                            }}
                        />
                        {errors.name && <p className='text-xs mt-1' style={{ color: '#dc2626' }}>{errors.name}</p>}
                    </div>

                    {/* Room */}
                    <div className='mb-5'>
                        <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>Room</label>
                        <input
                            name='room'
                            value={form.room}
                            onChange={handleChange}
                            placeholder='Room 101'
                            className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none'
                            style={{
                                border: errors.room ? '1px solid #dc2626' : '1px solid #C9A84C',
                                backgroundColor: '#F7F1E8',
                                color: '#1B3A2D'
                            }}
                        />
                        {errors.room && <p className='text-xs mt-1' style={{ color: '#dc2626' }}>{errors.room}</p>}
                    </div>

                    {/* Rent */}
                    <div className='mb-8'>
                        <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>Monthly Rent (₹)</label>
                        <input
                            name='rent'
                            value={form.rent}
                            onChange={handleChange}
                            placeholder='12000'
                            className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none'
                            style={{
                                border: errors.rent ? '1px solid #dc2626' : '1px solid #C9A84C',
                                backgroundColor: '#F7F1E8',
                                color: '#1B3A2D'
                            }}
                        />
                        {errors.rent && <p className='text-xs mt-1' style={{ color: '#dc2626' }}>{errors.rent}</p>}
                    </div>

                    <div className='flex gap-3'>
                        <button
                            onClick={() => navigate('/tenants')}
                            className='flex-1 py-3 rounded-lg font-semibold hover:opacity-80 transition text-sm'
                            style={{ backgroundColor: '#F7F1E8', color: '#1B3A2D', border: '1px solid #C9A84C' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className='flex-1 py-3 rounded-lg font-bold hover:opacity-90 transition text-sm'
                            style={{ backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }}
                        >
                            Add Tenant
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </PageTransition>
    )
}

export default AddTenantPage