import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { markAsPaid, removeTenant } from "../store/tenantSlice";
import Sidebar from "../components/Sidebar";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

function TenantsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tenants = useSelector((state) => state.tenants.tenants ?? []);

  const [search, setSearch] = useState("");
  const [filterRoom, setFilterRoom] = useState("all");
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [modal, setModal] = useState({
    open: false,
    tenant: null,
  });

  // Extract floor safely
  const getFloor = (room) => {
    if (!room) return null;

    const roomNumber = room.replace(/Room/i, "").trim();

    if (!roomNumber || isNaN(roomNumber)) return null;

    return Math.floor(Number(roomNumber) / 100).toString();
  };

  // Unique room list
  const uniqueRooms = useMemo(() => {
    return [...new Set(tenants.map((t) => t.room).filter(Boolean))].sort();
  }, [tenants]);

  // Unique floor list
  const uniqueFloors = useMemo(() => {
    return [
      ...new Set(tenants.map((t) => getFloor(t.room)).filter(Boolean)),
    ].sort((a, b) => Number(a) - Number(b));
  }, [tenants]);

  // Filter tenants
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const name = tenant.name?.toLowerCase() || "";
      const room = tenant.room?.toLowerCase() || "";

      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        room.includes(search.toLowerCase());

      const matchesRoom = filterRoom === "all" || tenant.room === filterRoom;

      const matchesFloor =
        filterFloor === "all" || getFloor(tenant.room) === filterFloor;

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "paid" && tenant.paid) ||
        (filterStatus === "pending" && !tenant.paid);

      return matchesSearch && matchesRoom && matchesFloor && matchesStatus;
    });
  }, [tenants, search, filterRoom, filterFloor, filterStatus]);

  const hasActiveFilters =
    search ||
    filterRoom !== "all" ||
    filterFloor !== "all" ||
    filterStatus !== "all";

  const clearFilters = () => {
    setSearch("");
    setFilterRoom("all");
    setFilterFloor("all");
    setFilterStatus("all");
  };

  const handleRemoveClick = (tenant) => {
    setModal({
      open: true,
      tenant,
    });
  };

  const handleConfirmRemove = () => {
    if (!modal.tenant) return;

    dispatch(removeTenant(modal.tenant.id));

    toast.success(`${modal.tenant.name} removed successfully`);

    setModal({
      open: false,
      tenant: null,
    });
  };

  const handleCancelRemove = () => {
    setModal({
      open: false,
      tenant: null,
    });
  };

  const handleMarkPaid = (tenant) => {
    dispatch(markAsPaid(tenant.id));
    toast.success(`${tenant.name} marked as paid`);
  };

  const selectStyle = {
    border: "1px solid #C9A84C",
    backgroundColor: "#fff",
    color: "#1B3A2D",
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F7F1E8" }}>
      <Sidebar />

      <div className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-x-hidden">
        <ConfirmModal
          isOpen={modal.open}
          title="Remove Tenant"
          message={`Are you sure you want to remove ${modal.tenant?.name} from ${modal.tenant?.room}? This action cannot be undone.`}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: "#1B3A2D" }}
            >
              Tenants
            </h1>

            <p className="text-sm mt-1" style={{ color: "#6b7c74" }}>
              Showing {filteredTenants.length} of {tenants.length} tenants
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by tenant or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 rounded-lg text-sm focus:outline-none"
              style={{
                border: "1px solid #C9A84C",
                backgroundColor: "#fff",
                color: "#1B3A2D",
              }}
            />

            <button
              onClick={() => navigate("/add-tenant")}
              className="px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition whitespace-nowrap"
              style={{
                backgroundColor: "#1B3A2D",
                color: "#C9A84C",
                border: "2px solid #C9A84C",
              }}
            >
              + Add Tenant
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl"
          style={{
            backgroundColor: "#fff",
            border: "1px solid #E8DFC8",
          }}
        >
          {/* Floor Filter */}
          <select
            value={filterFloor}
            onChange={(e) => {
              setFilterFloor(e.target.value);
              setFilterRoom("all");
            }}
            className="px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none"
            style={selectStyle}
          >
            <option value="all">All Floors</option>

            {uniqueFloors.map((floor) => (
              <option key={floor} value={floor}>
                Floor {floor}
              </option>
            ))}
          </select>

          {/* Room Filter */}
          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none"
            style={selectStyle}
          >
            <option value="all">All Rooms</option>

            {(filterFloor === "all"
              ? uniqueRooms
              : uniqueRooms.filter((room) => getFloor(room) === filterFloor)
            ).map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none"
            style={selectStyle}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition"
              style={{
                backgroundColor: "#fff",
                color: "#dc2626",
                border: "1px solid #dc2626",
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {(filterFloor !== "all" ||
          filterRoom !== "all" ||
          filterStatus !== "all") && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filterFloor !== "all" && (
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: "#1B3A2D",
                  color: "#C9A84C",
                }}
              >
                Floor {filterFloor}
              </span>
            )}

            {filterRoom !== "all" && (
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: "#1B3A2D",
                  color: "#C9A84C",
                }}
              >
                {filterRoom}
              </span>
            )}

            {filterStatus !== "all" && (
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: "#1B3A2D",
                  color: "#C9A84C",
                }}
              >
                {filterStatus === "paid" ? "Paid" : "Pending"}
              </span>
            )}
          </div>
        )}

        {/* Mobile Cards */}
        <div className="flex flex-col gap-4 md:hidden">
          {filteredTenants.length === 0 ? (
            <EmptyState
              hasFilters={hasActiveFilters}
              search={search}
              navigate={navigate}
            />
          ) : (
            filteredTenants.map((tenant) => (
              <div
                key={tenant.id}
                className="rounded-xl p-5 shadow-sm"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #C9A84C",
                }}
              >
                <div className="flex justify-between items-start mb-4 gap-3">
                  <div>
                    <p
                      className="font-bold text-lg cursor-pointer hover:underline"
                      style={{ color: "#1B3A2D" }}
                      onClick={() => navigate(`/tenant/${tenant.id}`)}
                    >
                      {tenant.name}
                    </p>

                    <p className="text-sm" style={{ color: "#6b7c74" }}>
                      {tenant.room}
                    </p>
                  </div>

                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                    style={
                      tenant.paid
                        ? {
                            backgroundColor: "#2D5A40",
                            color: "#C9A84C",
                          }
                        : {
                            backgroundColor: "#fff3cd",
                            color: "#856404",
                            border: "1px solid #ffc107",
                          }
                    }
                  >
                    {tenant.paid ? "Paid" : "Pending"}
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-sm" style={{ color: "#6b7c74" }}>
                    Floor: {getFloor(tenant.room)}
                  </p>

                  <p className="font-semibold" style={{ color: "#1B3A2D" }}>
                    ₹{tenant.rent}/month
                  </p>
                </div>

                <div className="flex gap-2">
                  {!tenant.paid && (
                    <button
                      onClick={() => handleMarkPaid(tenant)}
                      className="flex-1 py-2 rounded-lg font-semibold text-sm"
                      style={{
                        backgroundColor: "#2D5A40",
                        color: "#C9A84C",
                      }}
                    >
                      Mark Paid
                    </button>
                  )}

                  <button
                    onClick={() => handleRemoveClick(tenant)}
                    className="flex-1 py-2 rounded-lg font-semibold text-sm"
                    style={{
                      backgroundColor: "#fff",
                      color: "#dc2626",
                      border: "1px solid #dc2626",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        {/* Desktop Table */}
        <div
          className="hidden md:block rounded-xl overflow-hidden shadow-sm"
          style={{ border: "1px solid #C9A84C" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#1B3A2D" }}>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#C9A84C]">
                  Name
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-[#C9A84C]">
                  Room
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-[#C9A84C]">
                  Rent
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-[#C9A84C]">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-[#C9A84C]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <EmptyState
                      hasFilters={hasActiveFilters}
                      search={search}
                      navigate={navigate}
                    />
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant, index) => (
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

                    <td className="px-6 py-4" style={{ color: "#6b7c74" }}>
                      {tenant.room}
                    </td>

                    <td
                      className="px-6 py-4 font-semibold"
                      style={{ color: "#1B3A2D" }}
                    >
                      ₹{tenant.rent}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={
                          tenant.paid
                            ? {
                                backgroundColor: "#2D5A40",
                                color: "#C9A84C",
                              }
                            : {
                                backgroundColor: "#fff3cd",
                                color: "#856404",
                                border: "1px solid #ffc107",
                              }
                        }
                      >
                        {tenant.paid ? "Paid" : "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-4 flex gap-2">
                      {!tenant.paid && (
                        <button
                          onClick={() => handleMarkPaid(tenant)}
                          className="text-sm px-4 py-1.5 rounded-lg font-semibold hover:opacity-80 transition"
                          style={{
                            backgroundColor: "#2D5A40",
                            color: "#C9A84C",
                          }}
                        >
                          Mark Paid
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveClick(tenant)}
                        className="text-sm px-4 py-1.5 rounded-lg font-semibold hover:opacity-80 transition"
                        style={{
                          backgroundColor: "#fff",
                          color: "#dc2626",
                          border: "1px solid #dc2626",
                        }}
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

function EmptyState({ hasFilters, search, navigate }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-5xl mb-4">🏠</p>

      <p className="font-bold text-lg mb-1" style={{ color: "#1B3A2D" }}>
        No tenants found
      </p>

      <p className="text-sm mb-6" style={{ color: "#6b7c74" }}>
        {search || hasFilters
          ? "Try changing filters or search"
          : "Add your first tenant to get started"}
      </p>

      {!search && !hasFilters && (
        <button
          onClick={() => navigate("/add-tenant")}
          className="px-6 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition"
          style={{
            backgroundColor: "#1B3A2D",
            color: "#C9A84C",
            border: "2px solid #C9A84C",
          }}
        >
          + Add Tenant
        </button>
      )}
    </div>
  );
}

export default TenantsPage;
