import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarView({ events, onSelectRange, onEventClick }) {
  const fcEvents = events.map((e) => ({
    id: e.id,
    title: e.name || "Reservation",
    start: e.start,
    end: e.end,
    extendedProps: {
      purpose: e.purpose
    }
  }));

  function handleSelect(selectInfo) {
    const start = selectInfo.start;
    const end = selectInfo.end;
    if (start.getMinutes() !== 0 || end.getMinutes() !== 0) {
      alert("Please select exact hour slots (FullCalendar slotDuration is 1 hour).");
      return;
    }
    onSelectRange({ start, end });
  }

  function handleEventClick(info) {
    const e = info.event;
    onEventClick({
      id: e.id,
      name: e.title,
      purpose: e.extendedProps?.purpose || "",
      start: new Date(e.start),
      end: new Date(e.end)
    });
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek"
        }}
        allDaySlot={false}
        slotDuration="01:00:00"
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
          startTime: "06:00",
          endTime: "22:00"
        }}
        selectable={true}
        selectMirror={true}
        events={fcEvents}
        select={handleSelect}
        eventClick={handleEventClick}
        nowIndicator={true}
        height="auto"
      />
    </div>
  );
}
