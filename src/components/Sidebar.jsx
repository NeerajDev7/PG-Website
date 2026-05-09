import { useNavigate} from 'react-router-dom'
function Sidebar(){
    const navigate = useNavigate()
    return (
        <div className='w-56 bg-white shadow-sm flex flex-col'>
            <div className='px-6 py-6 border-b border-gray-100'>
                <h1 className='text-xl font-bold text-blue-600'>Social Co-Living PG</h1>
            </div>
            <nav className='flex flex-col p-4 gap-1'>
                <button onClick = {()=> navigate('/dashboard')} className='text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50'>Dashboard</button>
                <button onClick = {()=> navigate('/tenants')} className='text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50'>Tenants</button>
                <button onClick = {()=> navigate('/rooms')} className='text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50'>Rooms</button>
                <button onClick = {()=> navigate('/notifications')} className='text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50'>Notifications</button>
            </nav>
        </div>
    )
}
export default Sidebar