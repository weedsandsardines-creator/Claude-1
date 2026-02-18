import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_EVENTS } from '../constants';

const STORAGE_KEY = 'myweek-events';

function loadEvents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_EVENTS;
}

function saveEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {}
}

let nextId = Date.now();

export function useEvents() {
  const [events, setEvents] = useState(loadEvents);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const addEvent = useCallback((event) => {
    const id = String(nextId++);
    const newEvent = { ...event, id };
    setEvents((prev) => [...prev, newEvent]);
    return id;
  }, []);

  const updateEvent = useCallback((id, updates) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const moveEvent = useCallback((id, day, startHour, startMinute) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const durationH = e.endHour - e.startHour;
        const durationM = e.endMinute - e.startMinute;
        let endHour = startHour + durationH;
        let endMinute = startMinute + durationM;
        if (endMinute >= 60) { endHour++; endMinute -= 60; }
        if (endMinute < 0) { endHour--; endMinute += 60; }
        return { ...e, day, startHour, startMinute, endHour, endMinute };
      })
    );
  }, []);

  const resizeEvent = useCallback((id, endHour, endMinute) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (endMinute >= 60) { endHour++; endMinute -= 60; }
        const minEnd = e.startHour + (e.startMinute + 15) / 60;
        const actualEnd = endHour + endMinute / 60;
        if (actualEnd < minEnd) {
          endHour = e.startHour;
          endMinute = e.startMinute + 15;
          if (endMinute >= 60) { endHour++; endMinute -= 60; }
        }
        return { ...e, endHour, endMinute };
      })
    );
  }, []);

  return { events, addEvent, updateEvent, deleteEvent, moveEvent, resizeEvent };
}
