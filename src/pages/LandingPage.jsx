import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PageTransition from "../components/PageTransition";

function LandingPage() {
  const navigate = useNavigate();

  const [showLocationModal, setShowLocationModal] = useState(false);

  const amenities = [
    { icon: "📶", title: "High-speed Wifi", desc: "100 Mbps fibre connection" },
    {
      icon: "🍽️",
      title: "Home-cooked Food",
      desc: "Breakfast, lunch & dinner",
    },
    { icon: "❄️", title: "AC Rooms", desc: "All rooms air-conditioned" },
    { icon: "🧺", title: "Laundry", desc: "Weekly laundry service" },
    { icon: "🔒", title: "24/7 Security", desc: "CCTV & gated entry" },
    { icon: "🚗", title: "Parking", desc: "Bike & Car parking" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: "#F7F1E8" }}>
        
        {/* Navbar */}
        <nav
          style={{ backgroundColor: "#1B3A2D" }}
          className="flex justify-between items-center px-6 md:px-10 py-5"
        >
          <h1
            className="text-lg md:text-2xl font-bold tracking-wide"
            style={{ color: "#C9A84C" }}
          >
            Social Co-Living PG
          </h1>
        </nav>

        {/* Hero Section */}
        <div
          style={{ backgroundColor: "#1B3A2D" }}
          className="flex flex-col items-center justify-center py-20 md:py-32 text-center px-6"
        >
          <p
            className="text-xs font-semibold tracking-widest mb-4"
            style={{ color: "#C9A84C" }}
          >
            MARATHAHALLI, BANGALORE
          </p>

          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ color: "#F7F1E8" }}
          >
            Your Home <br />
            Away From Home
          </h2>

          <p
            className="text-base md:text-lg mb-10 max-w-xl"
            style={{ color: "#a0b8a8" }}
          >
            Premium co-living spaces designed for comfort, community, and
            convenience.
          </p>

          <button
            onClick={() =>
              document
                .getElementById("rooms-section")
                .scrollIntoView({ behavior: "smooth" })
            }
            style={{ backgroundColor: "#C9A84C", color: "#1B3A2D" }}
            className="px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-bold hover:opacity-90 transition tracking-wide"
          >
            Explore Rooms
          </button>
        </div>

        {/* Gold Divider */}
        <div style={{ backgroundColor: "#C9A84C", height: "3px" }} />

        {/* Amenities Section */}
        <div
          className="py-16 md:py-20 px-6 md:px-10"
          style={{ backgroundColor: "#F7F1E8" }}
        >
          <p
            className="text-center text-xs font-semibold tracking-widest mb-2"
            style={{ color: "#C9A84C" }}
          >
            WHAT WE OFFER
          </p>

          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-10"
            style={{ color: "#1B3A2D" }}
          >
            Our Amenities
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {amenities.map((item) => (
              <div
                key={item.title}
                className="rounded-xl p-4 md:p-6 text-center hover:shadow-lg transition"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #C9A84C",
                }}
              >
                <div className="text-3xl md:text-4xl mb-3">{item.icon}</div>

                <h3
                  className="font-bold text-sm md:text-base mb-1"
                  style={{ color: "#1B3A2D" }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-xs md:text-sm"
                  style={{ color: "#6b7c74" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Available Rooms */}
        <div
          id="rooms-section"
          className="py-16 md:py-20 px-6 md:px-10"
          style={{ backgroundColor: "#2D5A40" }}
        >
          <p
            className="text-center text-xs font-semibold tracking-widest mb-2"
            style={{ color: "#C9A84C" }}
          >
            FIND YOUR SPACE
          </p>

          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-10"
            style={{ color: "#F7F1E8" }}
          >
            Available Rooms
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              {
                type: "Single Occupancy",
                room: "Room 101",
                price: "25,000",
                img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
              },
              {
                type: "Double Sharing",
                room: "Room 203",
                price: "12,000",
                img: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&q=80",
              },
              {
                type: "Triple Sharing",
                room: "Room 305",
                price: "9,000",
                img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80",
              },
            ].map((item) => (
              <div
                key={item.room}
                className="rounded-xl overflow-hidden hover:shadow-xl transition"
                style={{
                  backgroundColor: "#F7F1E8",
                  border: "1px solid #C9A84C",
                }}
              >
                <img
                  src={item.img}
                  alt={item.type}
                  className="w-full h-28 md:h-36 object-cover"
                />

                <div className="p-4 md:p-5">
                  <h3
                    className="font-bold mb-1 text-sm md:text-base"
                    style={{ color: "#1B3A2D" }}
                  >
                    {item.type}
                  </h3>

                  <p
                    className="text-xs md:text-sm mb-4"
                    style={{ color: "#6b7c74" }}
                  >
                    {item.room}
                  </p>

                  <div className="flex justify-between items-center">
                    <span
                      className="font-bold text-lg md:text-xl"
                      style={{ color: "#C9A84C" }}
                    >
                      ₹{item.price}
                      <span
                        className="text-xs md:text-sm font-normal"
                        style={{ color: "#6b7c74" }}
                      >
                        /mo
                      </span>
                    </span>

                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "#1B3A2D",
                        color: "#C9A84C",
                      }}
                    >
                      Available
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gold Divider */}
        <div style={{ backgroundColor: "#C9A84C", height: "3px" }} />

        {/* Contact Section */}
        <div
          className="py-16 md:py-20 px-6 md:px-10"
          style={{ backgroundColor: "#1B3A2D" }}
        >
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            
            <div>
              <p
                className="text-xs font-semibold tracking-widest mb-2"
                style={{ color: "#C9A84C" }}
              >
                REACH OUT
              </p>

              <h2
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ color: "#F7F1E8" }}
              >
                Get in touch
              </h2>

              <p className="mb-2 text-sm" style={{ color: "#a0b8a8" }}>
                +91 9876543210
              </p>

              <p className="mb-2 text-sm" style={{ color: "#a0b8a8" }}>
                owner@gmail.com
              </p>

              <p
                className="mb-2 text-sm max-w-xs"
                style={{ color: "#a0b8a8" }}
              >
                12th Cross, Kaveri layout, Marathahalli Village, Bangalore
              </p>

              <button
                onClick={() => setShowLocationModal(true)}
                className="mt-4 text-sm font-medium hover:opacity-80 transition cursor-pointer"
                style={{ color: "#C9A84C" }}
              >
                📍 View PG Location
              </button>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button
                onClick={() => navigate("/login")}
                style={{
                  backgroundColor: "#C9A84C",
                  color: "#1B3A2D",
                }}
                className="px-8 py-4 rounded-lg text-base md:text-lg font-bold hover:opacity-90 transition w-full md:w-auto"
              >
                Tenant Login
              </button>

              <p
                className="text-center text-sm"
                style={{ color: "#a0b8a8" }}
              >
                Owner?{" "}
                <span
                  onClick={() => navigate("/owner/login")}
                  className="cursor-pointer underline hover:opacity-80 transition font-medium"
                  style={{ color: "#C9A84C" }}
                >
                  Login here
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Location Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            
            <div
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
              style={{ backgroundColor: "#F7F1E8" }}
            >
              
              {/* Close Button */}
              <button
                onClick={() => setShowLocationModal(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow-md hover:scale-105 transition"
              >
                ✕
              </button>

              {/* Header */}
              <div
                className="px-6 py-5 border-b"
                style={{ borderColor: "#C9A84C" }}
              >
                <h2
                  className="text-2xl font-bold"
                  style={{ color: "#1B3A2D" }}
                >
                  Our PG Location
                </h2>

                <p
                  className="text-sm mt-1"
                  style={{ color: "#6b7c74" }}
                >
                  Marathahalli, Bangalore
                </p>
              </div>

              {/* Map */}
              <a
                href="https://maps.google.com/?q=Marathahalli,Bangalore"
                target="_blank"
                rel="noreferrer"
              >
                <iframe
                  title="PG Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62230.12412632636!2d77.675226!3d12.959172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae140f1d8f6c41%3A0x7b4de0f5d5e3d7e6!2sMarathahalli%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1710000000000"
                  className="w-full h-[400px]"
                  loading="lazy"
                  allowFullScreen=""
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </a>

              {/* Footer */}
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                <div>
                  <p
                    className="font-semibold text-lg"
                    style={{ color: "#1B3A2D" }}
                  >
                    Social Co-Living PG
                  </p>

                  <p
                    className="text-sm"
                    style={{ color: "#6b7c74" }}
                  >
                    12th Cross, Kaveri layout, Marathahalli Village, Bangalore
                  </p>
                </div>

                <a
                  href="https://maps.google.com/?q=Marathahalli,Bangalore"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-lg font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: "#1B3A2D",
                    color: "#C9A84C",
                  }}
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default LandingPage;