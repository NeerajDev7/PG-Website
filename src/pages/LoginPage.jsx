import { useNavigate } from "react-router-dom"

function LoginPage(){
    const navigate = useNavigate()
    return(
        <div className=" min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Owner Login</h1>
                <p className="text-gray-500 mb-8">Sign in to manage your PG</p>

                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                    <input type ="email" placeholder = "owner@email.com" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500"/>     
                </div>
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Password</label>
                    <input type ="password" placeholder = "......." className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500"/>
                </div>
                <button onClick={()=> navigate('/dashboard')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg"> Sign in</button>
            </div>
        </div>
    )
}

export default LoginPage