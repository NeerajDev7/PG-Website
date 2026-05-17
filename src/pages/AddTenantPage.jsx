import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addTenant } from '../store/tenantSlice'
import Sidebar from '../components/Sidebar'
import toast from 'react-hot-toast'
import PageTransition from '../components/PageTransition'

// ✅ Moved outside AddTenantPage to prevent re-creation on every render
const Field = ({ label, name, placeholder, type = 'text', form, errors, handleChange }) => (
    <div className='mb-5'>
        <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>{label}</label>
        <input
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none'
            style={{
                border: errors[name] ? '1px solid #dc2626' : '1px solid #C9A84C',
                backgroundColor: '#F7F1E8',
                color: '#1B3A2D'
            }}
        />
        {errors[name] && <p className='text-xs mt-1' style={{ color: '#dc2626' }}>{errors[name]}</p>}
    </div>
)

function AddTenantPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const tenants = useSelector((state) => state.tenants.tenants)
    const rooms = useSelector((state) => state.tenants.rooms)

    const vacantRooms = rooms.filter(r =>
        !tenants.some(t => t.room === `Room ${r.number}`)
    )

    const [form, setForm] = useState({
        name: '',
        room: '',
        rent: '',
        phone: '',
        email: '',
        hometown: '',
        address: '',
        mealType: 'vegetarian',
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelation: '',
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'room') {
        const selectedRoom = vacantRooms.find(r => `Room ${r.number}` === value)
        setForm({ 
            ...form, 
            room: value, 
            rent: selectedRoom ? String(selectedRoom.price) : '' 
        })
        setErrors({ ...errors, room: '', rent: '' })
        return
    }

    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: '' })
}

    const validate = () => {
        const newErrors = {}

        if (!form.name.trim()) newErrors.name = 'Full name is required'
        else if (form.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters'

        if (!form.room) newErrors.room = 'Please select a room'

        if (!form.rent.trim()) newErrors.rent = 'Rent is required'
        else if (isNaN(form.rent) || Number(form.rent) <= 0) newErrors.rent = 'Enter a valid rent amount'

        if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
        else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) newErrors.phone = 'Enter a valid 10 digit Indian mobile number'

        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address'

        if (!form.hometown.trim()) newErrors.hometown = 'Hometown is required'
        if (!form.address.trim()) newErrors.address = 'Address is required'

        if (!form.emergencyName.trim()) newErrors.emergencyName = 'Emergency contact name is required'
        if (!form.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency contact phone is required'
        else if (!/^[6-9]\d{9}$/.test(form.emergencyPhone.trim())) newErrors.emergencyPhone = 'Enter a valid 10 digit mobile number'
        if (!form.emergencyRelation.trim()) newErrors.emergencyRelation = 'Relation is required'

        return newErrors
    }

    const handleSubmit = () => {
        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error('Please fix the errors before submitting')
            return
        }

        dispatch(addTenant({
            id: Date.now(),
            name: form.name.trim(),
            room: form.room,
            rent: Number(form.rent),
            paid: false,
            phone: form.phone.trim(),
            email: form.email.trim(),
            hometown: form.hometown.trim(),
            address: form.address.trim(),
            mealType: form.mealType,
            emergencyContact: {
                name: form.emergencyName.trim(),
                phone: form.emergencyPhone.trim(),
                relation: form.emergencyRelation.trim(),
            },
            rentHistory: [],
            documents: []
        }))

        toast.success(`${form.name} added successfully!`)
        navigate('/tenants')
    }

    const inputStyle = (field) => ({
        border: errors[field] ? '1px solid #dc2626' : '1px solid #C9A84C',
        backgroundColor: '#F7F1E8',
        color: '#1B3A2D'
    })

    // Shared props passed down to every Field
    const fieldProps = { form, errors, handleChange }

    return (
        <PageTransition>
            <div className='flex min-h-screen' style={{ backgroundColor: '#F7F1E8' }}>
                <Sidebar />
                <div className='flex-1 p-4 md:p-8 mt-16 md:mt-0'>
                    <div className='mb-6'>
                        <h1 className='text-2xl md:text-3xl font-bold' style={{ color: '#1B3A2D' }}>Add Tenant</h1>
                        <p className='mt-1 text-sm' style={{ color: '#6b7c74' }}>Fill in all details carefully</p>
                    </div>

                    <div
                        className='rounded-2xl p-6 md:p-10 shadow-sm w-full max-w-2xl'
                        style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                    >
                        {/* Basic Info */}
                        <h3 className='font-bold text-base mb-4' style={{ color: '#1B3A2D' }}>Basic Information</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>
                            <Field label='Full Name *' name='name' placeholder='Paul Allen' {...fieldProps} />
                            <Field label='Phone Number *' name='phone' placeholder='9876543210' type='tel' {...fieldProps} />
                            <Field label='Email' name='email' placeholder='paul@gmail.com' type='email' {...fieldProps} />
                            <Field label='Hometown *' name='hometown' placeholder='Chennai, Tamil Nadu' {...fieldProps} />
                        </div>

                        <div className='mb-5'>
                            <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>Full Address *</label>
                            <textarea
                                name='address'
                                value={form.address}
                                onChange={handleChange}
                                placeholder='Enter current address'
                                rows={2}
                                className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none resize-none'
                                style={inputStyle('address')}
                            />
                            {errors.address && <p className='text-xs mt-1' style={{ color: '#dc2626' }}>{errors.address}</p>}
                        </div>

                        {/* Meal Type */}
                        <div className='mb-5'>
                            <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>Meal Preference *</label>
                            <div className='flex gap-3'>
                                {['vegetarian', 'non-vegetarian'].map((type) => (
                                    <button
                                        key={type}
                                        type='button'
                                        onClick={() => setForm({ ...form, mealType: type })}
                                        className='flex-1 py-3 rounded-lg text-sm font-semibold transition capitalize'
                                        style={form.mealType === type
                                            ? { backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }
                                            : { backgroundColor: '#F7F1E8', color: '#1B3A2D', border: '1px solid #C9A84C' }
                                        }
                                    >
                                        {type === 'vegetarian' ? '🥦 Vegetarian' : '🍖 Non-Vegetarian'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Room + Rent */}
                        <h3 className='font-bold text-base mb-4 mt-6' style={{ color: '#1B3A2D' }}>Room Details</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>
                            <div className='mb-5'>
                                <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>Select Room *</label>
                                <select
                                    name='room'
                                    value={form.room}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none'
                                    style={inputStyle('room')}
                                >
                                    <option value=''>-- Select a vacant room --</option>
                                    {vacantRooms.map(r => (
                                        <option key={r.id} value={`Room ${r.number}`}>
                                            Room {r.number} — {r.type}
                                        </option>
                                    ))}
                                </select>
                                {errors.room && <p className='text-xs mt-1' style={{ color: '#dc2626' }}>{errors.room}</p>}
                                {vacantRooms.length === 0 && (
                                    <p className='text-xs mt-1' style={{ color: '#dc2626' }}>No vacant rooms available</p>
                                )}
                            </div>
                            <div className='mb-5'>
                                <label className='block text-sm font-semibold mb-2' style={{ color: '#1B3A2D' }}>Monthly Rent (₹) *</label>
                                <input
                                    name='rent'
                                    value={form.rent}
                                    onChange={handleChange}
                                    placeholder='12000'
                                    className='w-full px-4 py-3 rounded-lg text-sm focus:outline-none'
                                    style={inputStyle('rent')}
                                />
                                {errors.rent && <p className='text-xs mt-1' style={{ color: '#dc2626' }}>{errors.rent}</p>}
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <h3 className='font-bold text-base mb-4 mt-2' style={{ color: '#1B3A2D' }}>Emergency Contact</h3>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6'>
                            <Field label='Name *' name='emergencyName' placeholder='Suresh Kumar' {...fieldProps} />
                            <Field label='Phone *' name='emergencyPhone' placeholder='9845012345' type='tel' {...fieldProps} />
                            <Field label='Relation *' name='emergencyRelation' placeholder='Father' {...fieldProps} />
                        </div>

                        {/* Buttons */}
                        <div className='flex gap-3 mt-4'>
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