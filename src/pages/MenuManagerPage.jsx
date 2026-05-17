import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateMenu } from '../store/tenantSlice'
import Sidebar from '../components/Sidebar'
import PageTransition from '../components/PageTransition'
import toast from 'react-hot-toast'

function MenuManagerPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const menu = useSelector((state) => state.tenants.menu)

    const [selectedDay, setSelectedDay] = useState(0)
    const [editing, setEditing] = useState(null) // { mealType: 'breakfast' }
    const [editText, setEditText] = useState('')

    const handleEdit = (mealType) => {
        setEditing(mealType)
        setEditText(menu[selectedDay][mealType].join('\n'))
    }

    const handleSave = () => {
        const items = editText
            .split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0)

        if (items.length === 0) {
            toast.error('Add at least one item')
            return
        }

        dispatch(updateMenu({
            dayIndex: selectedDay,
            mealType: editing,
            items
        }))

        toast.success('Menu updated!')
        setEditing(null)
    }

    const mealSlots = [
        { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
        { key: 'lunch', label: 'Lunch', icon: '☀️' },
        { key: 'dinner', label: 'Dinner', icon: '🌙' },
    ]

    return (
        <PageTransition>
            <div className='flex min-h-screen' style={{ backgroundColor: '#F7F1E8' }}>
                <Sidebar />
                <div className='flex-1 p-4 md:p-8 mt-16 md:mt-0'>

                    <div className='flex justify-between items-center mb-8'>
                        <div>
                            <h1 className='text-2xl md:text-3xl font-bold' style={{ color: '#1B3A2D' }}>Menu Manager</h1>
                            <p className='mt-1 text-sm' style={{ color: '#6b7c74' }}>Edit weekly meal menu shown on landing page</p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className='px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition'
                            style={{ backgroundColor: '#fff', color: '#1B3A2D', border: '1px solid #C9A84C' }}
                        >
                            ← Back
                        </button>
                    </div>

                    {/* Day Selector */}
                    <div className='flex gap-2 overflow-x-auto pb-3 mb-8'>
                        {menu.map((item, index) => (
                            <button
                                key={item.day}
                                onClick={() => { setSelectedDay(index); setEditing(null) }}
                                className='flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition'
                                style={selectedDay === index
                                    ? { backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }
                                    : { backgroundColor: '#fff', color: '#1B3A2D', border: '1px solid #C9A84C' }
                                }
                            >
                                {item.day}
                            </button>
                        ))}
                    </div>

                    {/* Meal Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {mealSlots.map((slot) => (
                            <div
                                key={slot.key}
                                className='rounded-xl p-6 shadow-sm'
                                style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                            >
                                {/* Card Header */}
                                <div className='flex justify-between items-center mb-4'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xl'>{slot.icon}</span>
                                        <h3 className='font-bold' style={{ color: '#1B3A2D' }}>{slot.label}</h3>
                                    </div>
                                    {editing !== slot.key && (
                                        <button
                                            onClick={() => handleEdit(slot.key)}
                                            className='text-xs px-3 py-1.5 rounded-lg font-semibold hover:opacity-80 transition'
                                            style={{ backgroundColor: '#1B3A2D', color: '#C9A84C' }}
                                        >
                                            ✏️ Edit
                                        </button>
                                    )}
                                </div>

                                {editing === slot.key ? (
                                    <div>
                                        <p className='text-xs mb-2' style={{ color: '#6b7c74' }}>One item per line</p>
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            rows={6}
                                            className='w-full px-3 py-2 rounded-lg text-sm focus:outline-none resize-none mb-3'
                                            style={{ border: '1px solid #C9A84C', backgroundColor: '#F7F1E8', color: '#1B3A2D' }}
                                        />
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => setEditing(null)}
                                                className='flex-1 py-2 rounded-lg text-xs font-semibold hover:opacity-80 transition'
                                                style={{ backgroundColor: '#F7F1E8', color: '#1B3A2D', border: '1px solid #C9A84C' }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className='flex-1 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition'
                                                style={{ backgroundColor: '#1B3A2D', color: '#C9A84C' }}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <ul className='flex flex-col gap-2'>
                                        {menu[selectedDay][slot.key].map((item, idx) => (
                                            <li key={idx} className='text-sm flex items-center gap-2' style={{ color: '#6b7c74' }}>
                                                <span className='w-1.5 h-1.5 rounded-full flex-shrink-0' style={{ backgroundColor: '#C9A84C' }} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </PageTransition>
    )
}

export default MenuManagerPage