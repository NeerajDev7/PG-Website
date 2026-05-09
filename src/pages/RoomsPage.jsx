import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'

function RoomsPage() {
    const rooms = useSelector((state) => state.rooms.rooms)

    const vacant = rooms.filter(r => !r.occupied).length
    const occupied = rooms.filter(r => r.occupied).length

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Rooms</h1>
                        <p className="text-gray-500">{occupied} occupied · {vacant} vacant</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="bg-green-100 text-green-600 text-sm font-semibold px-4 py-2 rounded-full">
                            Vacant: {vacant}
                        </span>
                        <span className="bg-red-100 text-red-500 text-sm font-semibold px-4 py-2 rounded-full">
                            Occupied: {occupied}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {rooms.map((room) => (
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
                            <p className="text-gray-500 text-sm">Tenant: {room.tenant || '—'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RoomsPage