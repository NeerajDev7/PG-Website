import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";

function LandingPage() {
    const navigate = useNavigate();
    const [menuDay, setMenuDay] = useState(0);
    const weeklyMenu = useSelector((state) => state.tenants.menu || []);

    const amenities = [
        { icon: "📶", title: "High-speed Wifi", desc: "100 Mbps fibre connection" },
        { icon: "🍽️", title: "Home-cooked Food", desc: "Breakfast, lunch & dinner" },
        { icon: "❄️", title: "AC Rooms", desc: "All rooms air-conditioned" },
        { icon: "🧺", title: "Laundry", desc: "Weekly laundry service" },
        { icon: "🔒", title: "24/7 Security", desc: "CCTV & gated entry" },
        { icon: "🚗", title: "Parking", desc: "Bike & Car parking" },
    ];

    return (
        <PageTransition>
            <div className="min-h-screen" style={{ backgroundColor: "var(--bg-tertiary)" }}>

                {/* Navbar */}
                <nav style={{ backgroundColor: "var(--bg-primary)" }} className="flex justify-between items-center px-6 md:px-10 py-5">
                    <h1 className="text-lg md:text-2xl font-bold tracking-wide" style={{ color: "var(--accent)" }}>
                        Social Co-Living PG
                    </h1>
                </nav>

                {/* Hero Section */}
                <div style={{ backgroundColor: "var(--bg-primary)" }} className="flex flex-col items-center justify-center py-20 md:py-32 text-center px-6">
                    <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: "var(--accent)" }}>
                        MARATHAHALLI, BANGALORE
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: "var(--text-light)" }}>
                        Your Home <br />Away From Home
                    </h2>
                    <p className="text-base md:text-lg mb-10 max-w-xl" style={{ color: "var(--text-muted)" }}>
                        Premium co-living spaces designed for comfort, community, and convenience.
                    </p>
                    <button
                        onClick={() => document.getElementById("rooms-section").scrollIntoView({ behavior: "smooth" })}
                        style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
                        className="px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-bold hover:opacity-90 transition tracking-wide"
                    >
                        Explore Rooms
                    </button>
                </div>

                {/* Gold Divider */}
                <div style={{ backgroundColor: "var(--accent)", height: "3px" }} />

                {/* Amenities Section */}
                <div className="py-16 md:py-20 px-6 md:px-10" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                    <p className="text-center text-xs font-semibold tracking-widest mb-2" style={{ color: "var(--accent)" }}>WHAT WE OFFER</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: "var(--text-primary)" }}>Our Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
                        {amenities.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-xl p-4 md:p-6 text-center hover:shadow-lg transition"
                                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}
                            >
                                <div className="text-3xl md:text-4xl mb-3">{item.icon}</div>
                                <h3 className="font-bold text-sm md:text-base mb-1" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                                <p className="text-xs md:text-sm" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gold Divider */}
                <div style={{ backgroundColor: "var(--accent)", height: "3px" }} />

                {/* Weekly Menu */}
                <div className="py-16 md:py-20 px-6 md:px-10" style={{ backgroundColor: "var(--bg-primary)" }}>
                    <p className="text-center text-xs font-semibold tracking-widest mb-2" style={{ color: "var(--accent)" }}>
                        WHAT'S COOKING
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: "var(--text-light)" }}>
                        Weekly Menu
                    </h2>

                    <div className="max-w-3xl mx-auto">
                        {/* Day Pills */}
                        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
                            {weeklyMenu.map((item, index) => (
                                <button
                                    key={item.day}
                                    onClick={() => setMenuDay(index)}
                                    className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition"
                                    style={menuDay === index
                                        ? { backgroundColor: "var(--accent)", color: "var(--text-primary)" }
                                        : { backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)" }
                                    }
                                >
                                    {item.day.slice(0, 3)}
                                </button>
                            ))}
                        </div>

                        {/* Carousel Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={menuDay}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="rounded-2xl overflow-hidden"
                                style={{ border: "1px solid var(--border-color)" }}
                            >
                                {/* Day Header */}
                                <div className="px-6 py-4 flex justify-between items-center" style={{ backgroundColor: "var(--accent)" }}>
                                    <h3 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                                        {weeklyMenu[menuDay].day}
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setMenuDay((prev) => (prev - 1 + 7) % 7)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold hover:opacity-80 transition"
                                            style={{ backgroundColor: "var(--bg-primary)", color: "var(--accent)" }}
                                        >
                                            ←
                                        </button>
                                        <button
                                            onClick={() => setMenuDay((prev) => (prev + 1) % 7)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold hover:opacity-80 transition"
                                            style={{ backgroundColor: "var(--bg-primary)", color: "var(--accent)" }}
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>

                                {/* Meals Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                                    {[
                                        { meal: "Breakfast", icon: "🌅", items: weeklyMenu[menuDay].breakfast },
                                        { meal: "Lunch", icon: "☀️", items: weeklyMenu[menuDay].lunch },
                                        { meal: "Dinner", icon: "🌙", items: weeklyMenu[menuDay].dinner },
                                    ].map((slot, i) => (
                                        <div
                                            key={slot.meal}
                                            className="p-5"
                                            style={{ borderRight: i < 2 ? "1px solid var(--border-subtle)" : "none" }}
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-lg">{slot.icon}</span>
                                                <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{slot.meal}</p>
                                            </div>
                                            <ul className="flex flex-col gap-1.5">
                                                {slot.items.map((item, idx) => (
                                                    <li key={idx} className="text-sm flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                                                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--accent)" }} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Dot Indicators */}
                        <div className="flex justify-center gap-2 mt-5">
                            {weeklyMenu.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMenuDay(index)}
                                    className="rounded-full transition-all duration-300"
                                    style={{
                                        width: menuDay === index ? "24px" : "8px",
                                        height: "8px",
                                        backgroundColor: menuDay === index ? "var(--accent)" : "var(--bg-secondary)",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gold Divider */}
                <div style={{ backgroundColor: "var(--accent)", height: "3px" }} />

                {/* Available Rooms */}
                <div id="rooms-section" className="py-16 md:py-20 px-6 md:px-10" style={{ backgroundColor: "var(--bg-secondary)" }}>
                    <p className="text-center text-xs font-semibold tracking-widest mb-2" style={{ color: "var(--accent)" }}>FIND YOUR SPACE</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: "var(--text-light)" }}>Available Rooms</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
                        {[
                            { type: "Single Occupancy", room: "Room 101", price: "25,000", img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
                            { type: "Double Sharing", room: "Room 203", price: "12,000", img: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&q=80" },
                            { type: "Triple Sharing", room: "Room 305", price: "9,000", img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80" },
                        ].map((item) => (
                            <div
                                key={item.room}
                                className="rounded-xl overflow-hidden hover:shadow-xl transition"
                                style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}
                            >
                                <img src={item.img} alt={item.type} className="w-full h-28 md:h-36 object-cover" />
                                <div className="p-4 md:p-5">
                                    <h3 className="font-bold mb-1 text-sm md:text-base" style={{ color: "var(--text-primary)" }}>{item.type}</h3>
                                    <p className="text-xs md:text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{item.room}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg md:text-xl" style={{ color: "var(--accent)" }}>
                                            ₹{item.price}
                                            <span className="text-xs md:text-sm font-normal" style={{ color: "var(--text-secondary)" }}>/mo</span>
                                        </span>
                                        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: "var(--bg-primary)", color: "var(--accent)" }}>
                                            Available
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gold Divider */}
                <div style={{ backgroundColor: "var(--accent)", height: "3px" }} />

                {/* Contact + Owner + Map */}
                <div className="py-16 md:py-20 px-6 md:px-10" style={{ backgroundColor: "var(--bg-primary)" }}>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                            {/* Left Column */}
                            <div className="flex flex-col gap-10">

                                {/* Know Your Owner */}
                                <div>
                                    <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: "var(--accent)" }}>MEET THE OWNER</p>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: "var(--text-light)" }}>Know Your Owner</h2>
                                    <div className="flex items-center gap-5 mb-6">
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 rounded-full blur-lg opacity-40" style={{ backgroundColor: "var(--accent)" }} />
                                            <img
                                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
                                                alt="Owner"
                                                className="relative w-24 h-24 object-cover rounded-full border-2"
                                                style={{ borderColor: "var(--border-color)" }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text-light)" }}>Rajesh Kumar</h3>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#244635", color: "var(--accent)", border: "1px solid var(--border-color)" }}>
                                                    PG Owner
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#244635", color: "var(--accent)", border: "1px solid var(--border-color)" }}>
                                                    8+ Years Experience
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
                                        Managing PG accommodations in Bangalore for over 8 years.
                                        Focused on providing comfort, safety, cleanliness, and a
                                        friendly living experience for working professionals and students.
                                    </p>
                                </div>

                                {/* Get In Touch */}
                                <div>
                                    <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: "var(--accent)" }}>REACH OUT</p>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: "var(--text-light)" }}>Get in touch</h2>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Phone</p>
                                            <p style={{ color: "var(--text-light)" }}>+91 9876543210</p>
                                        </div>
                                        <div>
                                            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Email</p>
                                            <p style={{ color: "var(--text-light)" }}>owner@gmail.com</p>
                                        </div>
                                        <div>
                                            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Address</p>
                                            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-muted)" }}>
                                                12th Cross, Kaveri layout, Marathahalli Village, Bangalore
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="flex flex-col gap-5">

                                {/* Map */}
                                <div
                                    className="rounded-2xl overflow-hidden shadow-2xl"
                                    style={{ border: "1px solid var(--border-color)", backgroundColor: "var(--bg-tertiary)" }}
                                >
                                    <div className="px-4 py-3" style={{ backgroundColor: "var(--bg-primary)", borderBottom: "1px solid var(--border-color)" }}>
                                        <h3 className="font-bold text-sm" style={{ color: "var(--accent)" }}>PG Location</h3>
                                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Marathahalli, Bangalore</p>
                                    </div>
                                    <iframe
                                        title="PG Location"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62230.12412632636!2d77.675226!3d12.959172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae140f1d8f6c41%3A0x7b4de0f5d5e3d7e6!2sMarathahalli%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1710000000000"
                                        className="w-full h-[260px]"
                                        loading="lazy"
                                        allowFullScreen=""
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => navigate("/login")}
                                        style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
                                        className="flex-1 px-8 py-3 rounded-lg text-base font-bold hover:opacity-90 transition"
                                    >
                                        Tenant Login
                                    </button>
                                    <button
                                        onClick={() => navigate("/owner/login")}
                                        className="flex-1 px-8 py-3 rounded-lg text-base font-bold border transition hover:opacity-90"
                                        style={{ borderColor: "var(--border-color)", color: "var(--accent)" }}
                                    >
                                        Owner Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </PageTransition>
    );
}

export default LandingPage;