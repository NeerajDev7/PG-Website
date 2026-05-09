import { useState } from 'react'
import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'

function RoomsPage() {
    const rooms = useSelector((state) => state.rooms.rooms)
    const tenants = useSelector((state) => state.tenants.tenants)
    const [filter, setFilter] = useState('All')

    const vacant = rooms.filter(r => !r.occupied).length
    const occupied = rooms.filter(r => r.occupied).length

    const getTenant = (roomNumber) => {
        return tenants.find(t => t.room === `Room ${roomNumber}`)
    }

    const filtered = rooms.filter(r => {
        if (filter === 'Vacant') return !r.occupied
        if (filter === 'Occupied') return r.occupied
        return true
    })

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Rooms</h1>
                        <p className="text-gray-500">{occupied} occupied · {vacant} vacant</p>
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Vacant', 'Occupied'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                    filter === f
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {filtered.map((room) => {
                        const tenant = getTenant(room.number)
                        return (
                            <div
                                key={room.id}
                                className={`bg-white rounded-xl border p-6 shadow-sm ${room.occupied ? 'border-red-100' : 'border-green-100'}`}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-2xl font-bold text-gray-800">Room {room.number}</h2>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${room.occupied ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
                                        {room.occupied ? 'Occupied' : 'Vacant'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-1">Type: {room.type}</p>
                                <p className="text-gray-500 text-sm mb-1">Price: ₹{room.price}</p>
                                <p className="text-gray-500 text-sm">Tenant: {tenant ? tenant.name : '—'}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default RoomsPage