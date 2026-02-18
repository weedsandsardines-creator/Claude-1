import { useRef, useState, useCallback, useEffect } from 'react';
import { DAYS, DAY_LABELS, START_HOUR, END_HOUR, HOUR_HEIGHT, EVENT_COLORS } from '../constants';
import EventBlock from './EventBlock';
import './CalendarGrid.css';

function snapToGrid(value, gridSize) {
  return Math.round(value / gridSize) * gridSize;
}

function hourMinFromY(y) {
  const totalMinutes = (y / HOUR_HEIGHT) * 60 + START_HOUR * 60;
  const snappedMinutes = snapToGrid(totalMinutes, 15);
  const hour = Math.floor(snappedMinutes / 60);
  const minute = snappedMinutes % 60;
  return { hour, minute };
}

export default function CalendarGrid({
  events,
  weekDates,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onMoveEvent,
  onResizeEvent,
}) {
  const gridRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [ghostEvent, setGhostEvent] = useState(null);
  const dragRef = useRef(null);

  const hours = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) hours.push(h);

  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  const formatHourLabel = (h) => {
    if (h === 0) return '12a';
    if (h < 12) return `${h}a`;
    if (h === 12) return '12p';
    return `${h - 12}p`;
  };

  // Click on empty space to create event
  const handleGridClick = useCallback((e) => {
    if (dragRef.current?.moved) return;
    const col = e.target.closest('.calendar-day-col');
    if (!col) return;
    const dayIndex = parseInt(col.dataset.day, 10);
    const rect = col.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const { hour, minute } = hourMinFromY(y);
    let endHour = hour + 1;
    let endMinute = minute;
    if (endHour > END_HOUR) { endHour = END_HOUR; endMinute = 0; }

    const colorIndex = Math.floor(Math.random() * EVENT_COLORS.length);
    onAddEvent({
      title: 'new event',
      day: dayIndex,
      startHour: hour,
      startMinute: minute,
      endHour,
      endMinute,
      colorIndex,
    });
  }, [onAddEvent]);

  // Drag to move
  const handleMoveStart = useCallback((event, e) => {
    const col = e.target.closest('.calendar-day-col');
    if (!col) return;
    const rect = col.getBoundingClientRect();
    const offsetY = e.clientY - rect.top - ((event.startHour - START_HOUR + event.startMinute / 60) * HOUR_HEIGHT);

    dragRef.current = {
      type: 'move',
      eventId: event.id,
      startX: e.clientX,
      startY: e.clientY,
      offsetY,
      originalDay: event.day,
      moved: false,
    };
    setDragState({ type: 'move', eventId: event.id });

    const handleMove = (me) => {
      if (!dragRef.current) return;
      const dx = me.clientX - dragRef.current.startX;
      const dy = me.clientY - dragRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true;
      if (!dragRef.current.moved) return;

      // Find which column we're over
      const cols = gridRef.current.querySelectorAll('.calendar-day-col');
      let targetDay = dragRef.current.originalDay;
      for (const c of cols) {
        const cr = c.getBoundingClientRect();
        if (me.clientX >= cr.left && me.clientX <= cr.right) {
          targetDay = parseInt(c.dataset.day, 10);
          break;
        }
      }

      const targetCol = gridRef.current.querySelector(`.calendar-day-col[data-day="${targetDay}"]`);
      if (!targetCol) return;
      const cr = targetCol.getBoundingClientRect();
      const y = me.clientY - cr.top - dragRef.current.offsetY;
      const { hour, minute } = hourMinFromY(Math.max(0, y));

      setGhostEvent({ day: targetDay, hour, minute });
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      if (dragRef.current?.moved && ghostEvent === null) {
        // use the last known ghost
      }
      setDragState(null);
      setGhostEvent(null);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, []);

  // Apply moves via effect
  useEffect(() => {
    if (!dragState || dragState.type !== 'move' || !ghostEvent) return;

    const handleUp = () => {
      if (ghostEvent) {
        onMoveEvent(dragState.eventId, ghostEvent.day, ghostEvent.hour, ghostEvent.minute);
      }
    };

    window.addEventListener('mouseup', handleUp, { once: true });
    return () => window.removeEventListener('mouseup', handleUp);
  }, [dragState, ghostEvent, onMoveEvent]);

  // Drag to resize
  const handleResizeStart = useCallback((event, e) => {
    dragRef.current = {
      type: 'resize',
      eventId: event.id,
      startY: e.clientY,
      originalEndHour: event.endHour,
      originalEndMinute: event.endMinute,
      moved: false,
    };
    setDragState({ type: 'resize', eventId: event.id });

    const col = e.target.closest('.calendar-day-col');
    const colRect = col?.getBoundingClientRect();

    const handleMove = (me) => {
      if (!dragRef.current || !colRect) return;
      dragRef.current.moved = true;
      const y = me.clientY - colRect.top;
      const { hour, minute } = hourMinFromY(Math.max(0, Math.min(y, totalHeight)));
      onResizeEvent(dragRef.current.eventId, hour, minute);
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      setDragState(null);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [onResizeEvent, totalHeight]);

  const isToday = (date) => {
    const now = new Date();
    return date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
  };

  return (
    <div className="calendar-grid-wrapper">
      {/* Day headers */}
      <div className="calendar-header-row">
        <div className="time-gutter-header" />
        {weekDates.map((date, i) => (
          <div key={i} className={`day-header ${isToday(date) ? 'day-header--today' : ''}`}>
            <span className="day-header-name">{DAY_LABELS[i]}</span>
            <span className="day-header-date">{date.getDate()}</span>
          </div>
        ))}
      </div>

      {/* Scrollable grid body */}
      <div className="calendar-body">
        <div className="calendar-grid" ref={gridRef} onClick={handleGridClick}>
          {/* Time gutter */}
          <div className="time-gutter">
            {hours.map((h) => (
              <div key={h} className="time-label" style={{ height: HOUR_HEIGHT }}>
                <span>{formatHourLabel(h)}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((date, dayIndex) => (
            <div
              key={dayIndex}
              className={`calendar-day-col ${isToday(date) ? 'calendar-day-col--today' : ''}`}
              data-day={dayIndex}
              style={{ height: totalHeight }}
            >
              {/* Hour lines */}
              {hours.map((h) => (
                <div key={h} className="hour-line" style={{ top: (h - START_HOUR) * HOUR_HEIGHT }} />
              ))}

              {/* Events */}
              {events
                .filter((ev) => ev.day === dayIndex)
                .map((ev) => (
                  <EventBlock
                    key={ev.id}
                    event={ev}
                    onUpdate={onUpdateEvent}
                    onDelete={onDeleteEvent}
                    onMoveStart={handleMoveStart}
                    onResizeStart={handleResizeStart}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
