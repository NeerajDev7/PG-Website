import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateMenu, setMenu } from "../store/tenantSlice";
import Sidebar from "../components/Sidebar";
import PageTransition from "../components/PageTransition";
import toast from "react-hot-toast";

function MenuManagerPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menu = useSelector((state) => state.tenants.menu);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/menu")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((row) => ({
          day: row.day,
          breakfast: row.breakfast,
          lunch: row.lunch,
          dinner: row.dinner,
        }));
        dispatch(setMenu(formatted));
      })
      .catch((err) => console.error("Failed to fetch menu:", err));
  }, []);

  const [selectedDay, setSelectedDay] = useState(0);
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (mealType) => {
    setEditing(mealType);
    setEditText(menu[selectedDay][mealType].join("\n"));
  };

  const handleSave = () => {
    const items = editText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (items.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    const dayId = selectedDay + 1; // matches your menu table's auto-increment ids (1-7, Mon-Sun)

    fetch(`http://127.0.0.1:5000/api/menu/${dayId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mealType: editing, items }),
    })
      .then((res) => res.json())
      .then(() => {
        dispatch(
          updateMenu({
            dayIndex: selectedDay,
            mealType: editing,
            items,
          }),
        );
        toast.success("Menu updated!");
        setEditing(null);
      })
      .catch((err) => {
        console.error("Failed to update menu:", err);
        toast.error("Failed to update menu");
      });
  };

  const mealSlots = [
    { key: "breakfast", label: "Breakfast", icon: "🌅" },
    { key: "lunch", label: "Lunch", icon: "☀️" },
    { key: "dinner", label: "Dinner", icon: "🌙" },
  ];

  return (
    <PageTransition>
      <div
        className="flex min-h-screen overflow-x-hidden"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <Sidebar />

        <div className="flex-1 p-4 md:p-8 mt-20 md:mt-0 overflow-x-hidden">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Menu Manager
              </h1>

              <p
                className="mt-1 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Edit weekly meal menu shown on landing page
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-fit px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              ← Back
            </button>
          </div>

          {/* DAY SELECTOR */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
            {menu.map((item, index) => (
              <button
                key={item.day}
                onClick={() => {
                  setSelectedDay(index);
                  setEditing(null);
                }}
                className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition whitespace-nowrap"
                style={
                  selectedDay === index
                    ? {
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--accent)",
                        border: "2px solid var(--border-color)",
                      }
                    : {
                        backgroundColor: "var(--bg-card)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border-color)",
                      }
                }
              >
                {item.day}
              </button>
            ))}
          </div>

          {/* MEAL CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {mealSlots.map((slot) => (
              <div
                key={slot.key}
                className="rounded-2xl p-5 md:p-6 shadow-sm"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {/* CARD HEADER */}
                <div className="flex justify-between items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl flex-shrink-0">{slot.icon}</span>

                    <h3
                      className="font-bold truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {slot.label}
                    </h3>
                  </div>

                  {editing !== slot.key && (
                    <button
                      onClick={() => handleEdit(slot.key)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold hover:opacity-80 transition whitespace-nowrap"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--accent)",
                      }}
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>

                {editing === slot.key ? (
                  <div>
                    <p
                      className="text-xs mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      One item per line
                    </p>

                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none resize-none mb-3"
                      style={{
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-tertiary)",
                        color: "var(--text-primary)",
                      }}
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(null)}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold hover:opacity-80 transition"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-primary)",
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleSave}
                        className="flex-1 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--accent)",
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {menu[selectedDay][slot.key].map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm flex items-start gap-2 break-words"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: "var(--accent)" }}
                        />

                        <span className="break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default MenuManagerPage;
