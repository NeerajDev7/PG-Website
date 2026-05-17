import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { markAsPaid, removeTenant } from "../store/tenantSlice";
import Sidebar from "../components/Sidebar";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

function TenantsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tenants = useSelector((state) => state.tenants.tenants);
  const [search, setSearch] = useState("");
  const [filterRoom, setFilterRoom] = useState("all");
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modal, setModal] = useState({ open: false, tenant: null });

  // Derive unique rooms and floors from tenants
  const uniqueRooms = [...new Set(tenants.map((t) => t.room))].sort()
  const uniqueFloors = [...new Set(tenants.map((t) => {
    const num = t.room?.replace("Room ", "").trim()
    return num ? num[0] + "00" : null
  }).filter(Boolean))].sort()

  const getFloor = (room) => {
    const num = room?.replace("Room ", "").trim()
    return num ? num[0] + "00" : null
  }

  const filtered = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.room.toLowerCase().includes(search.toLowerCase())
    const matchesRoom = filterRoom === "all" || t.room === filterRoom
    const matchesFloor = filterFloor === "all" || getFloor(t.room) === filterFloor
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "paid" && t.paid) ||
      (filterStatus === "pending" && !t.paid)
    return matchesSearch && matchesRoom && matchesFloor && matchesStatus
  })

  const handleRemoveClick = (tenant) => setModal({ open: true, tenant })
  const handleConfirmRemove = () => {
    dispatch(removeTenant(modal.tenant.id));
    toast.success(`${modal.tenant.name} removed`);
    setModal({ open: false, tenant: null });
  };
  const handleCancelRemove = () => setModal({ open: false, tenant: null })

  const hasActiveFilters = filterRoom !== "all" || filterFloor !== "all" || filterStatus !== "all"

  const clearFilters = () => {
    setFilterRoom("all")
    setFilterFloor("all")
    setFilterStatus("all")
    setSearch("")
  }

  const selectStyle = {
    border: "1px solid #C9A84C",
    backgroundColor: "#fff",
    color: "#1B3A2D",
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F7F1E8" }}>
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 mt-16 md:mt-0">
        <ConfirmModal
          isOpen={modal.open}
          title="Remove Tenant"
          message={`Are you sure you want to remove ${modal.tenant?.name} from ${modal.tenant?.room}? This cannot be undone.`}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#1B3A2D" }}>
              Tenants
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#6b7c74" }}>
              {filtered.length} of {tenants.length} tenants
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 rounded-lg text-sm focus:outline-none"
              style={{ border: "1px solid #C9A84C", backgroundColor: "#fff", color: "#1B3A2D" }}
            />
            <button
              onClick={() => navigate("/add-tenant")}
              style={{ backgroundColor: "#1B3A2D", color: "#C9A84C", border: "2px solid #C9A84C" }}
              className="px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm whitespace-nowrap"
            >
              + Add Tenant
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {/* Floor filter */}
          <select
            value={filterFloor}
            onChange={(e) => { setFilterFloor(e.target.value); setFilterRoom("all") }}
            className="px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none"
            style={selectStyle}
          >
            <option value="all">All Floors</option>
            {uniqueFloors.map((floor) => (
              <option key={floor} value={floor}>Floor {floor[0]}</option>
            ))}
          </select>

          {/* Room filter */}
          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none"
            style={selectStyle}
          >
            <option value="all">All Rooms</option>
            {(filterFloor === "all" ? uniqueRooms : uniqueRooms.filter(r => getFloor(r) === filterFloor)).map((room) => (
              <option key={room} value={room}>{room}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none"
            style={selectStyle}
          >
            <option value="all">All Status</option>
            <option value="paid">✅ Paid</option>
            <option value="pending">⚠️ Pending</option>
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition"
              style={{ backgroundColor: "#F7F1E8", color: "#dc2626", border: "1px solid #dc2626" }}
            >
              ✕ Clear
            </button>
          )}

          {/* Active filter tags */}
          {filterFloor !== "all" && (
            <span className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#1B3A2D", color: "#C9A84C" }}>
              Floor {filterFloor[0]}
            </span>
          )}
          {filterRoom !== "all" && (
            <span className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#1B3A2D", color: "#C9A84C" }}>
              {filterRoom}
            </span>
          )}
          {filterStatus !== "all" && (
            <span className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#1B3A2D", color: "#C9A84C" }}>
              {filterStatus === "paid" ? "✅ Paid" : "⚠️ Pending"}
            </span>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="flex flex-col gap-4 md:hidden">
          {filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-xl"
              style={{ backgroundColor: "#fff", border: "1px solid #C9A84C" }}
            >
              <p className="text-5xl mb-4">🏠</p>
              <p className="font-bold text-lg mb-1" style={{ color: "#1B3A2D" }}>No tenants found</p>
              <p className="text-sm mb-6" style={{ color: "#6b7c74" }}>
                {search || hasActiveFilters ? "Try different filters" : "Add your first tenant to get started"}
              </p>
              {!search && !hasActiveFilters && (
                <button
                  onClick={() => navigate("/add-tenant")}
                  className="px-6 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                  style={{ backgroundColor: "#1B3A2D", color: "#C9A84C", border: "2px solid #C9A84C" }}
                >
                  + Add Tenant
                </button>
              )}
            </div>
          ) : (
            filtered.map((tenant) => (
              <div
                key={tenant.id}
                className="rounded-xl p-5 shadow-sm"
                style={{ backgroundColor: "#fff", border: "1px solid #C9A84C" }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p
                      className="font-bold text-lg cursor-pointer hover:underline"
                      style={{ color: "#1B3A2D" }}
                      onClick={() => navigate(`/tenant/${tenant.id}`)}
                    >
                      {tenant.name}
                    </p>
                    <p className="text-sm" style={{ color: "#6b7c74" }}>{tenant.room}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={
                      tenant.paid
                        ? { backgroundColor: "#2D5A40", color: "#C9A84C" }
                        : { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffc107" }
                    }
                  >
                    {tenant.paid ? "Paid" : "Pending"}
                  </span>
                </div>
                <p className="text-sm font-semibold mb-4" style={{ color: "#1B3A2D" }}>
                  ₹{tenant.rent}/month
                </p>
                <div className="flex gap-2">
                  {!tenant.paid && (
                    <button
                      onClick={() => { dispatch(markAsPaid(tenant.id)); toast.success(`${tenant.name} marked as paid!`) }}
                      className="flex-1 py-2 rounded-lg font-semibold text-sm"
                      style={{ backgroundColor: "#2D5A40", color: "#C9A84C" }}
                    >
                      Mark Paid
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveClick(tenant)}
                    className="flex-1 py-2 rounded-lg font-semibold text-sm"
                    style={{ backgroundColor: "#fff", color: "#dc2626", border: "1px solid #dc2626" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div
          className="hidden md:block rounded-xl overflow-hidden shadow-sm"
          style={{ border: "1px solid #C9A84C" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#1B3A2D" }}>
                <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "#C9A84C" }}>Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "#C9A84C" }}>Room</th>
                <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "#C9A84C" }}>Floor</th>
                <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "#C9A84C" }}>Rent</th>
                <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "#C9A84C" }}>Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: "#C9A84C" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="flex flex-col items-center justify-center py-16">
                      <p className="text-5xl mb-4">🏠</p>
                      <p className="font-bold text-lg mb-1" style={{ color: "#1B3A2D" }}>No tenants found</p>
                      <p className="text-sm mb-6" style={{ color: "#6b7c74" }}>
                        {search || hasActiveFilters ? "Try different filters" : "Add your first tenant to get started"}
                      </p>
                      {!search && !hasActiveFilters && (
                        <button
                          onClick={() => navigate("/add-tenant")}
                          className="px-6 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                          style={{ backgroundColor: "#1B3A2D", color: "#C9A84C", border: "2px solid #C9A84C" }}
                        >
                          + Add Tenant
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((tenant, index) => (
                  <tr
                    key={tenant.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#F7F1E8",
                      borderBottom: "1px solid #E8DFC8",
                    }}
                  >
                    <td
                      className="px-6 py-4 font-medium cursor-pointer hover:underline"
                      style={{ color: "#1B3A2D" }}
                      onClick={() => navigate(`/tenant/${tenant.id}`)}
                    >
                      {tenant.name}
                    </td>
                    <td className="px-6 py-4" style={{ color: "#6b7c74" }}>{tenant.room}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6b7c74" }}>
                      Floor {getFloor(tenant.room)?.[0]}
                    </td>
                    <td className="px-6 py-4 font-medium" style={{ color: "#1B3A2D" }}>
                      ₹{tenant.rent}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={
                          tenant.paid
                            ? { backgroundColor: "#2D5A40", color: "#C9A84C" }
                            : { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffc107" }
                        }
                      >
                        {tenant.paid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {!tenant.paid && (
                        <button
                          onClick={() => { dispatch(markAsPaid(tenant.id)); toast.success(`${tenant.name} marked as paid!`) }}
                          className="text-sm px-4 py-1.5 rounded-lg font-semibold hover:opacity-80 transition"
                          style={{ backgroundColor: "#2D5A40", color: "#C9A84C" }}
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveClick(tenant)}
                        className="text-sm px-4 py-1.5 rounded-lg font-semibold hover:opacity-80 transition"
                        style={{ backgroundColor: "#fff", color: "#dc2626", border: "1px solid #dc2626" }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TenantsPage;