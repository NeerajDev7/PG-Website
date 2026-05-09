import { useNavigate } from 'react-router-dom'

function LandingPage() {
    const navigate = useNavigate();

    const amenities = [
        { icon: "📶", title: "High-speed Wifi", desc: "100 Mbps fibre connection" },
        { icon: "🍽️", title: "Home-cooked Food", desc: "Breakfast, lunch & dinner" },
        { icon: "❄️", title: "AC Rooms", desc: "All rooms air-conditioned" },
        { icon: "🧺", title: "Laundry", desc: "Weekly laundry service" },
        { icon: "🔒", title: "24/7 Security", desc: "CCTV & gated entry" },
        { icon: "🚗", title: "Parking", desc: "Bike & Car parking" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-sm">
                <h1 className="text-2xl font-bold text-blue-600">Social Co-Living PG</h1>
                <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                    Owner Login
                </button>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 text-center px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Your Home Away From Home
                </h2>
                <p className="text-gray-500 text-lg mb-8">
                    Premium PG accommodation in Koramangala, Bangalore
                </p>
                <button
                    onClick={() => document.getElementById('rooms-section').scrollIntoView({ behavior: 'smooth' })}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
                >
                    View Rooms
                </button>
            </div>

            {/* Amenities Section */}
            <div className="py-20 px-6 md:px-10">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {amenities.map((item) => (
                        <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                            <div className="text-4xl mb-3">{item.icon}</div>
                            <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Available Rooms */}
            <div id="rooms-section" className="py-20 px-6 md:px-10 bg-gray-50">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Available Rooms</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                        { type: "Single Occupancy", room: "Room 101", price: "25000/-" },
                        { type: "Double Sharing", room: "Room 203", price: "12000/-" },
                        { type: "Triple Sharing", room: "Room 305", price: "9000/-" },
                    ].map((item) => (
                        <div key={item.room} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                            <div className="h-36 bg-gray-200 flex items-center justify-center text-gray-400">
                                Room Photo
                            </div>
                            <div className="p-5">
                                <h3 className="font-semibold text-gray-800">{item.type}</h3>
                                <p className="text-gray-500 text-sm mb-3">{item.room}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-600 font-bold text-lg">
                                        {item.price}
                                        <span className="text-gray-400 text-sm font-normal">/month</span>
                                    </span>
                                    <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                                        Available
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact */}
            <div className="py-20 px-10 bg-white">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in touch</h2>
                        <p className="text-gray-500 mb-2"><span className="text-gray-800 font-medium">+91 9876543210</span></p>
                        <p className="text-gray-500 mb-2"><span className="text-gray-800 font-medium">owner@gmail.com</span></p>
                        <p className="text-gray-500 mb-2"><span className="text-gray-800 font-medium">12th Cross, Kaveri layout, Tulasi Theatre Road, Marathahalli Village, Bangalore</span></p>
                    </div>
                    <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium">
                        Owner login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;