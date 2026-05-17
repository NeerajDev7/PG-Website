import { useState } from 'react'
import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'
import PageTransition from '../components/PageTransition'

function RoomsPage() {
    const tenants = useSelector((state) => state.tenants.tenants ?? [])
    const rooms = useSelector((state) => state.tenants.rooms ?? [])
    const [filter, setFilter] = useState('All')

    const getTenant = (roomNumber) => {
        return tenants.find(t => t.room === `Room ${roomNumber}`)
    }

    const enriched = rooms.map(room => ({
        ...room,
        occupied: !!getTenant(room.number),
        tenant: getTenant(room.number)
    }))

    const occupied = enriched.filter(r => r.occupied).length
    const vacant = enriched.filter(r => !r.occupied).length

    const filtered = enriched.filter(r => {
        if (filter === 'Vacant') return !r.occupied
        if (filter === 'Occupied') return r.occupied
        return true
    })

    return (
        <PageTransition>
        <div className="flex min-h-screen" style={{ backgroundColor: '#F7F1E8' }}>
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 mt-16 md:mt-0">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#1B3A2D' }}>Rooms</h1>
                        <p className='mt-1 text-sm' style={{ color: '#6b7c74' }}>{occupied} occupied · {vacant} vacant</p>
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Vacant', 'Occupied'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className="px-3 md:px-4 py-2 rounded-lg text-sm font-semibold transition"
                                style={filter === f
                                    ? { backgroundColor: '#1B3A2D', color: '#C9A84C', border: '2px solid #C9A84C' }
                                    : { backgroundColor: '#fff', color: '#1B3A2D', border: '1px solid #C9A84C' }
                                }
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {filtered.map((room) => (
                        <div
                            key={room.id}
                            className="rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition"
                            style={{
                                backgroundColor: '#fff',
                                border: room.occupied ? '1px solid #C9A84C' : '1px solid #2D5A40'
                            }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#1B3A2D' }}>Room {room.number}</h2>
                                <span
                                    className="text-xs font-bold px-3 py-1 rounded-full"
                                    style={room.occupied
                                        ? { backgroundColor: '#1B3A2D', color: '#C9A84C' }
                                        : { backgroundColor: '#2D5A40', color: '#F7F1E8' }
                                    }
                                >
                                    {room.occupied ? 'Occupied' : 'Vacant'}
                                </span>
                            </div>
                            <p className="text-sm mb-1" style={{ color: '#6b7c74' }}>Type: {room.type}</p>
                            <p className="text-sm mb-1" style={{ color: '#6b7c74' }}>
                                Price: <span className='font-bold ml-1' style={{ color: '#C9A84C' }}>₹{room.price}</span>
                            </p>
                            <p className="text-sm" style={{ color: '#6b7c74' }}>
                                Tenant: <span className='font-medium' style={{ color: '#1B3A2D' }}>
                                    {room.tenant ? room.tenant.name : '—'}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </PageTransition>
    )
}

export default RoomsPage