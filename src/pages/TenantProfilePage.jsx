import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { addDocument, removeDocument } from "../store/tenantSlice";
import Sidebar from "../components/Sidebar";
import PageTransition from "../components/PageTransition";
import toast from "react-hot-toast";

function TenantProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const tenants = useSelector((state) => state.tenants.tenants);
  const rooms = useSelector((state) => state.tenants.rooms);

  const tenant = tenants.find((t) => t.id === Number(id));
  const room = rooms.find(
    (r) => r.number === tenant?.room?.replace("Room ", ""),
  );

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large — max 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(
        addDocument({
          tenantId: tenant.id,
          name: file.name,
          data: reader.result,
          type: file.type,
        }),
      );
      toast.success(`${file.name} uploaded!`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDoc = (docIndex) => {
    dispatch(removeDocument({ tenantId: tenant.id, docIndex }));
    toast.success("Document removed");
  };

  const getFileIcon = (type) => {
    if (type?.includes("image")) return "🖼️";
    if (type?.includes("pdf")) return "📄";
    return "📎";
  };

  if (!tenant) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: "#F7F1E8" }}>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: "#1B3A2D" }}>Tenant not found.</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen" style={{ backgroundColor: "#F7F1E8" }}>
        <Sidebar />
        <div className="flex-1 p-4 md:p-8 mt-16 md:mt-0">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/tenants")}
              className="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition"
              style={{
                backgroundColor: "#fff",
                color: "#1B3A2D",
                border: "1px solid #C9A84C",
              }}
            >
              Back
            </button>
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "#1B3A2D" }}
              >
                {tenant.name}
              </h1>
              <p className="text-sm mt-1" style={{ color: "#6b7c74" }}>
                {tenant.room} · {room?.type}
              </p>
            </div>
            <span
              className="ml-auto px-4 py-2 rounded-full text-sm font-bold"
              style={
                tenant.paid
                  ? { backgroundColor: "#2D5A40", color: "#C9A84C" }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <div
              className="rounded-xl p-6 shadow-sm"
              style={{ backgroundColor: "#fff", border: "1px solid #C9A84C" }}
            >
              <h3
                className="font-bold text-lg mb-5"
                style={{ color: "#1B3A2D" }}
              >
                Personal Details
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Phone", value: tenant.phone || "—" },
                  { label: "Email", value: tenant.email || "—" },
                  { label: "Hometown", value: tenant.hometown || "—" },
                  { label: "Address", value: tenant.address || "—" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      borderBottom: "1px solid #F0EAD8",
                      paddingBottom: "12px",
                    }}
                  >
                    <p className="text-xs mb-1" style={{ color: "#6b7c74" }}>
                      {item.label}
                    </p>
                    <p
                      className="font-medium text-sm"
                      style={{ color: "#1B3A2D" }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Room + Emergency Contact */}
            <div className="flex flex-col gap-6">
              <div
                className="rounded-xl p-6 shadow-sm"
                style={{
                  backgroundColor: "#1B3A2D",
                  border: "1px solid #C9A84C",
                }}
              >
                <h3
                  className="font-bold text-lg mb-5"
                  style={{ color: "#C9A84C" }}
                >
                  Room Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Room", value: tenant.room },
                    { label: "Type", value: room?.type || "—" },
                    { label: "Monthly Rent", value: "₹" + tenant.rent },
                    { label: "Status", value: "Active" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs mb-1" style={{ color: "#a0b8a8" }}>
                        {item.label}
                      </p>
                      <p
                        className="font-semibold text-sm"
                        style={{
                          color:
                            item.label === "Monthly Rent"
                              ? "#C9A84C"
                              : "#F7F1E8",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl p-6 shadow-sm"
                style={{ backgroundColor: "#fff", border: "1px solid #C9A84C" }}
              >
                <h3
                  className="font-bold text-lg mb-5"
                  style={{ color: "#1B3A2D" }}
                >
                  Emergency Contact
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      label: "Name",
                      value: tenant.emergencyContact?.name || "—",
                    },
                    {
                      label: "Phone",
                      value: tenant.emergencyContact?.phone || "—",
                    },
                    {
                      label: "Relation",
                      value: tenant.emergencyContact?.relation || "—",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        borderBottom: "1px solid #F0EAD8",
                        paddingBottom: "12px",
                      }}
                    >
                      <p className="text-xs mb-1" style={{ color: "#6b7c74" }}>
                        {item.label}
                      </p>
                      <p
                        className="font-medium text-sm"
                        style={{ color: "#1B3A2D" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rent History */}
            <div
              className="md:col-span-2 rounded-xl p-6 shadow-sm"
              style={{ backgroundColor: "#fff", border: "1px solid #C9A84C" }}
            >
              <h3
                className="font-bold text-lg mb-5"
                style={{ color: "#1B3A2D" }}
              >
                Rent History
              </h3>
              {tenant.rentHistory && tenant.rentHistory.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: "#1B3A2D" }}>
                      <th
                        className="text-left px-4 py-3 text-xs font-semibold"
                        style={{ color: "#C9A84C" }}
                      >
                        Month
                      </th>
                      <th
                        className="text-left px-4 py-3 text-xs font-semibold"
                        style={{ color: "#C9A84C" }}
                      >
                        Date
                      </th>
                      <th
                        className="text-left px-4 py-3 text-xs font-semibold"
                        style={{ color: "#C9A84C" }}
                      >
                        Amount
                      </th>
                      <th
                        className="text-left px-4 py-3 text-xs font-semibold"
                        style={{ color: "#C9A84C" }}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenant.rentHistory.map((entry, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor: index % 2 === 0 ? "#fff" : "#F7F1E8",
                          borderBottom: "1px solid #E8DFC8",
                        }}
                      >
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: "#1B3A2D" }}
                        >
                          {entry.month}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: "#6b7c74" }}
                        >
                          {entry.date}
                        </td>
                        <td
                          className="px-4 py-3 text-sm font-semibold"
                          style={{ color: "#C9A84C" }}
                        >
                          {"₹" + entry.amount}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-bold px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: "#2D5A40",
                              color: "#C9A84C",
                            }}
                          >
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-4xl mb-3">📋</p>
                  <p
                    className="font-semibold mb-1"
                    style={{ color: "#1B3A2D" }}
                  >
                    No payment history yet
                  </p>
                  <p className="text-sm" style={{ color: "#6b7c74" }}>
                    History will appear once rent is marked as paid
                  </p>
                </div>
              )}
            </div>

            {/* Documents */}
            <div
              className="md:col-span-2 rounded-xl p-6 shadow-sm"
              style={{ backgroundColor: "#fff", border: "1px solid #C9A84C" }}
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg" style={{ color: "#1B3A2D" }}>
                  Documents
                </h3>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                  style={{
                    backgroundColor: "#1B3A2D",
                    color: "#C9A84C",
                    border: "2px solid #C9A84C",
                  }}
                >
                  + Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleUpload}
                />
              </div>

              {tenant.documents && tenant.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {tenant.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="rounded-xl p-4 flex flex-col gap-3"
                      style={{
                        backgroundColor: "#F7F1E8",
                        border: "1px solid #C9A84C",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {getFileIcon(doc.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold truncate"
                            style={{ color: "#1B3A2D" }}
                          >
                            {doc.name}
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: "#6b7c74" }}
                          >
                            Uploaded {doc.uploadedOn}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={doc.data}
                          download={doc.name}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-center hover:opacity-80 transition"
                          style={{
                            backgroundColor: "#2D5A40",
                            color: "#C9A84C",
                          }}
                        >
                          Download
                        </a>

                        <button
                          onClick={() => handleRemoveDoc(index)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80 transition"
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
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-4xl mb-3">📁</p>
                  <p
                    className="font-semibold mb-1"
                    style={{ color: "#1B3A2D" }}
                  >
                    No documents uploaded
                  </p>
                  <p className="text-sm" style={{ color: "#6b7c74" }}>
                    Upload Aadhaar, ID proof or any other documents
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default TenantProfilePage;
