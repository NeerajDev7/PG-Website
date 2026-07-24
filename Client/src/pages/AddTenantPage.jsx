import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addTenant } from "../store/tenantSlice";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import PageTransition from "../components/PageTransition";

function Field({
  label,
  name,
  placeholder,
  type = "text",
  form,
  errors,
  handleChange,
  inputStyle,
}) {
  return (
    <div className="mb-5">
      <label
        className="block text-sm font-semibold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none"
        style={inputStyle(name)}
      />

      {errors[name] && (
        <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>
          {errors[name]}
        </p>
      )}
    </div>
  );
}

function AddTenantPage() {
  console.log("AddTenantPage rendered");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tenants = useSelector((state) => state.tenants.tenants);
  const rooms = useSelector((state) => state.tenants.rooms);

  const vacantRooms = rooms.filter(
    (r) => !tenants.some((t) => t.room === `Room ${r.number}`),
  );

  const [form, setForm] = useState({
    name: "",
    room: "",
    rent: "",
    phone: "",
    email: "",
    hometown: "",
    address: "",
    mealType: "vegetarian",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    else if (form.name.trim().length < 3)
      e.name = "Name must be at least 3 characters";
    if (!form.room) e.room = "Please select a room";
    if (!form.rent.trim()) e.rent = "Rent is required";
    else if (isNaN(form.rent) || Number(form.rent) <= 0)
      e.rent = "Enter a valid rent amount";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      e.phone = "Enter a valid 10 digit Indian mobile number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.hometown.trim()) e.hometown = "Hometown is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.emergencyName.trim())
      e.emergencyName = "Emergency contact name is required";
    if (!form.emergencyPhone.trim())
      e.emergencyPhone = "Emergency contact phone is required";
    else if (!/^[6-9]\d{9}$/.test(form.emergencyPhone.trim()))
      e.emergencyPhone = "Enter a valid 10 digit mobile number";
    if (!form.emergencyRelation.trim())
      e.emergencyRelation = "Relation is required";
    return e;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    const roomNumber = form.room.replace(/\D/g, "");

    const newTenant = {
      name: form.name.trim(),
      room: `Room ${roomNumber}`,
      rent: Number(form.rent),
      paid: false,
    };

    fetch("https://pg-manager-backend-mryl.onrender.com/api/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTenant),
    })
      .then((res) => res.json())
      .then((savedTenant) => {
        dispatch(
          addTenant({
            ...savedTenant,
            phone: form.phone.trim(),
            email: form.email.trim(),
            hometown: form.hometown.trim(),
            address: form.address.trim(),
            mealType: form.mealType,
            emergencyContact: {
              name: form.emergencyName.trim(),
              phone: form.emergencyPhone.trim(),
              relation: form.emergencyRelation.trim(),
            },
            rentHistory: [],
            documents: [],
          }),
        );
        toast.success(`${form.name} added successfully!`);
        navigate("/tenants");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add tenant");
      });
  };

  const inputStyle = (field) => ({
    border: errors[field]
      ? "1px solid var(--danger)"
      : "1px solid var(--border-color)",
    backgroundColor: "var(--bg-input)",
    color: "var(--text-primary)",
  });

  return (
    <PageTransition>
      <div
        className="flex min-h-screen"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <Sidebar />
        <div className="flex-1 p-4 md:p-8 mt-16 md:mt-0">
          <div className="mb-6">
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Add Tenant
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Fill in all details carefully
            </p>
          </div>

          <div
            className="rounded-2xl p-6 md:p-10 shadow-sm w-full max-w-2xl"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h3
              className="font-bold text-base mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field
                label="Full Name *"
                name="name"
                placeholder="Paul Allen"
                value={form.name}
                error={errors.name}
                onChange={handleChange}
                style={inputStyle("name")}
              />
              <Field
                label="Phone Number *"
                name="phone"
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                error={errors.phone}
                onChange={handleChange}
                style={inputStyle("phone")}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="paul@gmail.com"
                value={form.email}
                error={errors.email}
                onChange={handleChange}
                style={inputStyle("email")}
              />
              <Field
                label="Hometown *"
                name="hometown"
                placeholder="Chennai, Tamil Nadu"
                value={form.hometown}
                error={errors.hometown}
                onChange={handleChange}
                style={inputStyle("hometown")}
              />
            </div>

            <div className="mb-5">
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Full Address *
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter current address"
                rows={2}
                className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none resize-none"
                style={inputStyle("address")}
              />
              {errors.address && (
                <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>
                  {errors.address}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Meal Preference *
              </label>
              <div className="flex gap-3">
                {["vegetarian", "non-vegetarian"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, mealType: type })}
                    className="flex-1 py-3 rounded-lg text-sm font-semibold transition capitalize"
                    style={
                      form.mealType === type
                        ? {
                            backgroundColor: "var(--bg-primary)",
                            color: "var(--accent)",
                            border: "2px solid var(--accent)",
                          }
                        : {
                            backgroundColor: "var(--bg-input)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-color)",
                          }
                    }
                  >
                    {type === "vegetarian"
                      ? "🥦 Vegetarian"
                      : "🍖 Non-Vegetarian"}
                  </button>
                ))}
              </div>
            </div>

            <h3
              className="font-bold text-base mb-4 mt-6"
              style={{ color: "var(--text-primary)" }}
            >
              Room Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div className="mb-5">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Select Room *
                </label>
                <select
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none"
                  style={inputStyle("room")}
                >
                  <option value="">-- Select a vacant room --</option>
                  {vacantRooms.map((r) => (
                    <option key={r.id} value={`Room ${r.number}`}>
                      Room {r.number} — {r.type} — ₹{r.price}/mo
                    </option>
                  ))}
                </select>
                {errors.room && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--danger)" }}
                  >
                    {errors.room}
                  </p>
                )}
                {vacantRooms.length === 0 && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--danger)" }}
                  >
                    No vacant rooms available
                  </p>
                )}
              </div>
              <div className="mb-5">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Monthly Rent (₹) *
                </label>
                <input
                  name="rent"
                  value={form.rent}
                  onChange={handleChange}
                  placeholder="12000"
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none"
                  style={inputStyle("rent")}
                />
                {errors.rent && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--danger)" }}
                  >
                    {errors.rent}
                  </p>
                )}
              </div>
            </div>

            <h3
              className="font-bold text-base mb-4 mt-2"
              style={{ color: "var(--text-primary)" }}
            >
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
              <Field
                label="Name *"
                name="emergencyName"
                placeholder="Suresh Kumar"
                value={form.emergencyName}
                error={errors.emergencyName}
                onChange={handleChange}
                style={inputStyle("emergencyName")}
              />
              <Field
                label="Phone *"
                name="emergencyPhone"
                type="tel"
                placeholder="9845012345"
                value={form.emergencyPhone}
                error={errors.emergencyPhone}
                onChange={handleChange}
                style={inputStyle("emergencyPhone")}
              />
              <Field
                label="Relation *"
                name="emergencyRelation"
                placeholder="Father"
                value={form.emergencyRelation}
                error={errors.emergencyRelation}
                onChange={handleChange}
                style={inputStyle("emergencyRelation")}
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate("/tenants")}
                className="flex-1 py-3 rounded-lg font-semibold hover:opacity-80 transition text-sm"
                style={{
                  backgroundColor: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-lg font-bold hover:opacity-90 transition text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--accent)",
                  border: "2px solid var(--accent)",
                }}
              >
                Add Tenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default AddTenantPage;
