import React, { useEffect, useState } from "react";
import CalendarView from "./components/CalendarView";
import BookingModal from "./components/BookingModal";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "reservations_v1";

function loadReservations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((r) => ({ ...r, start: new Date(r.start), end: new Date(r.end) }));
  } catch (e) {
    console.error("Failed to load reservations", e);
    return [];
  }
}

function saveReservations(rows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

export default function App() {
  const [reservations, setReservations] = useState(() => loadReservations());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectionRange, setSelectionRange] = useState(null);

  useEffect(() => {
    saveReservations(reservations);
  }, [reservations]);

  function openForNew(range) {
    setEditing(null);
    setSelectionRange(range);
    setIsModalOpen(true);
  }

  function openForEdit(event) {
    setEditing(event);
    setSelectionRange(null);
    setIsModalOpen(true);
  }

  function handleCreateOrUpdate(formData) {
    const start = new Date(formData.start);
    const end = new Date(formData.end);

    if (start.getMinutes() !== 0 || start.getSeconds() !== 0 || end.getMinutes() !== 0 || end.getSeconds() !== 0) {
      alert("Bookings must start and end exactly on the hour.");
      return false;
    }
    const durationHours = (end - start) / (1000 * 60 * 60);
    if (!Number.isInteger(durationHours) || durationHours <= 0) {
      alert("Booking duration must be a whole number of hours.");
      return false;
    }

    const overlapping = reservations.some((r) => {
      if (editing && r.id === editing.id) return false;
      return start < new Date(r.end) && end > new Date(r.start);
    });
    if (overlapping) {
      alert("This slot overlaps with an existing reservation.");
      return false;
    }

    if (editing) {
      const updated = reservations.map((r) => (r.id === editing.id ? { ...r, name: formData.name, purpose: formData.purpose, start, end } : r));
      setReservations(updated);
    } else {
      const newRes = {
        id: uuidv4(),
        name: formData.name,
        purpose: formData.purpose,
        start,
        end,
        createdAt: new Date()
      };
      setReservations((s) => [...s, newRes]);
    }

    setIsModalOpen(false);
    setEditing(null);
    setSelectionRange(null);
    return true;
  }

  function handleDelete(id) {
    if (!confirm("Delete this reservation?")) return;
    setReservations((s) => s.filter((r) => r.id !== id));
    setIsModalOpen(false);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Gym Reservation — Prototype</h1>
        <div className="text-sm text-slate-600">Hour booking • Daily & weekly view</div>
      </header>

      <CalendarView
        events={reservations}
        onSelectRange={(range) => openForNew(range)}
        onEventClick={(event) => openForEdit(event)}
      />

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(null);
          setSelectionRange(null);
        }}
        onConfirm={handleCreateOrUpdate}
        onDelete={handleDelete}
        initialData={
          editing
            ? {
                id: editing.id,
                name: editing.name,
                purpose: editing.purpose,
                start: editing.start,
                end: editing.end
              }
            : selectionRange
            ? {
                name: "",
                purpose: "",
                start: selectionRange.start,
                end: selectionRange.end
              }
            : null
        }
      />

      <footer className="mt-8 text-xs text-slate-500">
        This is a frontend prototype — replace localStorage with an API & DB for production.
      </footer>
    </div>
  );
}
