import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function BookingModal({ isOpen, onClose, onConfirm, onDelete, initialData }) {
  const [bookingForm, setBookingForm] = useState({
    name: "",
    purpose: "",
    start: null,
    end: null,
    id: null
  });

  useEffect(() => {
    if (initialData) {
      setBookingForm({
        id: initialData.id || null,
        name: initialData.name || "",
        purpose: initialData.purpose || "",
        start: initialData.start ? new Date(initialData.start) : null,
        end: initialData.end ? new Date(initialData.end) : null
      });
    } else {
      setBookingForm({ name: "", purpose: "", start: null, end: null, id: null });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.purpose || !bookingForm.start || !bookingForm.end) {
      alert("Please fill out all fields.");
      return;
    }
    const accepted = onConfirm({
      id: bookingForm.id,
      name: bookingForm.name,
      purpose: bookingForm.purpose,
      start: bookingForm.start,
      end: bookingForm.end
    });
    if (!accepted) {
      // onConfirm already showed error message
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-lg z-40 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-900">Confirm Reservation</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Start</label>
              <input
                type="text"
                readOnly
                value={bookingForm.start ? dayjs(bookingForm.start).format("YYYY-MM-DD HH:mm") : ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">End</label>
              <input
                type="text"
                readOnly
                value={bookingForm.end ? dayjs(bookingForm.end).format("YYYY-MM-DD HH:mm") : ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Duration</label>
            <div className="text-sm text-slate-600">
              {bookingForm.start && bookingForm.end
                ? `${Math.round((bookingForm.end - bookingForm.start) / (1000 * 60 * 60))} hour(s)`
                : "—"}
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Reservation Name (Group/Person)</label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Varsity Basketball"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={bookingForm.name}
                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Purpose / Activity</label>
              <input
                type="text"
                required
                placeholder="e.g. Team Practice, Open Gym"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={bookingForm.purpose}
                onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>

            {bookingForm.id && (
              <button
                type="button"
                onClick={() => onDelete(bookingForm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                Delete
              </button>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
