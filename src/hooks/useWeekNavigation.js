import { useState, useCallback, useMemo } from 'react';

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function useWeekNavigation() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const weekLabel = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    return `${formatDate(weekStart)} – ${formatDate(end)}`;
  }, [weekStart]);

  const goToPrevWeek = useCallback(() => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }, []);

  const goToThisWeek = useCallback(() => {
    setWeekStart(getWeekStart(new Date()));
  }, []);

  const isThisWeek = useMemo(() => {
    const current = getWeekStart(new Date());
    return weekStart.getTime() === current.getTime();
  }, [weekStart]);

  return { weekStart, weekDates, weekLabel, goToPrevWeek, goToNextWeek, goToThisWeek, isThisWeek };
}
