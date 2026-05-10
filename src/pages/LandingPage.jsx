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
        <div className="min-h-screen" style={{ backgroundColor: '#F7F1E8' }}>

            {/* Navbar */}
            <nav style={{ backgroundColor: '#1B3A2D' }} className="flex justify-between items-center px-10 py-5">
                <h1 className="text-2xl font-bold tracking-wide" style={{ color: '#C9A84C' }}>
                    Social Co-Living PG
                </h1>
                <button
                    onClick={() => navigate('/login')}
                    style={{ border: '2px solid #C9A84C', color: '#C9A84C', backgroundColor: 'transparent' }}
                    className="px-5 py-2 rounded-lg font-semibold hover:opacity-80 transition"
                >
                    Owner Login
                </button>
            </nav>

            {/* Hero Section */}
            <div
                style={{ backgroundColor: '#1B3A2D' }}
                className="flex flex-col items-center justify-center py-32 text-center px-4"
            >
                <p className="text-sm font-semibold tracking-widest mb-4" style={{ color: '#C9A84C' }}>
                    MARATHAHALLI, BANGALORE
                </p>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: '#F7F1E8' }}>
                    Your Home <br />Away From Home
                </h2>
                <p className="text-lg mb-10 max-w-xl" style={{ color: '#a0b8a8' }}>
                    Premium co-living spaces designed for comfort, community, and convenience.
                </p>
                <button
                    onClick={() => document.getElementById('rooms-section').scrollIntoView({ behavior: 'smooth' })}
                    style={{ backgroundColor: '#C9A84C', color: '#1B3A2D' }}
                    className="px-10 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition tracking-wide"
                >
                    Explore Rooms
                </button>
            </div>

            {/* Divider */}
            <div style={{ backgroundColor: '#C9A84C', height: '3px' }} />

            {/* Amenities Section */}
            <div className="py-20 px-6 md:px-10" style={{ backgroundColor: '#F7F1E8' }}>
                <p className="text-center text-xs font-semibold tracking-widest mb-2" style={{ color: '#C9A84C' }}>WHAT WE OFFER</p>
                <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1B3A2D' }}>
                    Our Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {amenities.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-xl p-6 text-center hover:shadow-lg transition"
                            style={{ backgroundColor: '#fff', border: '1px solid #C9A84C' }}
                        >
                            <div className="text-4xl mb-3">{item.icon}</div>
                            <h3 className="font-bold mb-1" style={{ color: '#1B3A2D' }}>{item.title}</h3>
                            <p className="text-sm" style={{ color: '#6b7c74' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Available Rooms */}
            <div id="rooms-section" className="py-20 px-6 md:px-10" style={{ backgroundColor: '#2D5A40' }}>
                <p className="text-center text-xs font-semibold tracking-widest mb-2" style={{ color: '#C9A84C' }}>FIND YOUR SPACE</p>
                <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#F7F1E8' }}>
                    Available Rooms
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                        { type: "Single Occupancy", room: "Room 101", price: "25,000" },
                        { type: "Double Sharing", room: "Room 203", price: "12,000" },
                        { type: "Triple Sharing", room: "Room 305", price: "9,000" },
                    ].map((item) => (
                        <div
                            key={item.room}
                            className="rounded-xl overflow-hidden hover:shadow-xl transition"
                            style={{ backgroundColor: '#F7F1E8', border: '1px solid #C9A84C' }}
                        >
                            <div className="h-36 flex items-center justify-center text-sm font-medium" style={{ backgroundColor: '#1B3A2D', color: '#C9A84C' }}>
                                Room Photo
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold mb-1" style={{ color: '#1B3A2D' }}>{item.type}</h3>
                                <p className="text-sm mb-4" style={{ color: '#6b7c74' }}>{item.room}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-xl" style={{ color: '#C9A84C' }}>
                                        ₹{item.price}
                                        <span className="text-sm font-normal" style={{ color: '#6b7c74' }}>/mo</span>
                                    </span>
                                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#1B3A2D', color: '#C9A84C' }}>
                                        Available
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gold Divider */}
            <div style={{ backgroundColor: '#C9A84C', height: '3px' }} />

            {/* Contact */}
            <div className="py-20 px-10" style={{ backgroundColor: '#1B3A2D' }}>
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: '#C9A84C' }}>REACH OUT</p>
                        <h2 className="text-3xl font-bold mb-6" style={{ color: '#F7F1E8' }}>Get in touch</h2>
                        <p className="mb-2 text-sm" style={{ color: '#a0b8a8' }}>+91 9876543210</p>
                        <p className="mb-2 text-sm" style={{ color: '#a0b8a8' }}>owner@gmail.com</p>
                        <p className="mb-2 text-sm max-w-xs" style={{ color: '#a0b8a8' }}>12th Cross, Kaveri layout, Marathahalli Village, Bangalore</p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        style={{ backgroundColor: '#C9A84C', color: '#1B3A2D' }}
                        className="px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition"
                    >
                        Owner Login
                    </button>
                </div>
            </div>

        </div>
    );
}

export default LandingPage;