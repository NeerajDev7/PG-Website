import{useState} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {addTenant} from '../store/tenantSlice'
import Sidebar from '../components/Sidebar'

function AddTenantPage(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form,setForm] = useState({
        name :'',
        room:'',
        rent:'',
    })
    const handleChange = (e) =>{
        setForm({...form,[e.target.name] : e.target.value})
    }
    const handleSubmit = () =>{
        if(!form.name || !form.room || !form.rent) return
        dispatch(addTenant({
            id : Date.now(),
            name : form.name,
            room : form.room,
            rent : Number(form.rent),
            paid : false
        }))
        navigate('/tenants')
    }

    return(
        <div className='flex min-h-screen bg-gray-50'>
            <Sidebar/>
            <div className='flex-1 p-8'>
                 <h1 className='text-3xl font-bold text-gray-800 mb-2'>Add Tenant</h1>
                 <p className='text-gray-500 mb-8'>Fill in the details below</p>
                 <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-lg'>
                    <div className='mb-5'>
                        <label className='block text-sm font-semibold text-gray-600 mb-2'>Full Name</label>
                        <input name = "name" onChange={handleChange} placeholder='Paul allen' className='w-full border border-gray-300 rounded-lg px-4 py-3 focus : outline-none focus:border-blue-500'/>
                    </div>
                    <div className='mb-5'>
                        <label className='block text-sm font-semibold text-gray-600 mb-2'>Room</label>
                        <input name = "room" onChange={handleChange} placeholder='Room 101' className='w-full border border-gray-300 rounded-lg px-4 py-3 focus : outline-none focus:border-blue-500'/>
                    </div>
                    <div className='mb-8'>
                        <label className='block text-sm font-semibold text-gray-600 mb-2'>Monthly rent (/-)</label>
                        <input name = "rent" onChange={handleChange} placeholder='12000/-' className='w-full border border-gray-300 rounded-lg px-4 py-3 focus : outline-none focus:border-blue-500'/>
                    </div>
                    <button onClick={handleSubmit} className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg'>
                        Add Tenant
                    </button>
                </div>        
            </div>
        </div>   
    )
}
export default AddTenantPage