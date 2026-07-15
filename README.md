# Gym Reservations Prototype

This is a small frontend prototype that shows a weekly/daily hourly calendar and allows creating hourly reservations via a modal form. Reservations are stored in localStorage.

Run:
1. npm install
2. npm run dev
3. Open the URL Vite prints (usually http://localhost:5173)

Notes:
- Uses FullCalendar (timeGrid plugin) for calendar UI.
- Uses Tailwind CDN for styling.
- Replace localStorage persistence with a backend API (POST /reservations etc.) to make it multi-user.
- Client-side prevents overlapping bookings and enforces start/end alignment to the hour.
