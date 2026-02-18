import { useState, useRef, useCallback } from 'react';
import { EVENT_COLORS, HOUR_HEIGHT, START_HOUR } from '../constants';
import ColorPicker from './ColorPicker';
import './EventBlock.css';

function formatTime(h, m) {
  const period = h >= 12 ? 'p' : 'a';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, '0')}${period}`;
}

export default function EventBlock({
  event,
  onUpdate,
  onDelete,
  onMoveStart,
  onResizeStart,
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const blockRef = useRef(null);
  const inputRef = useRef(null);

  const color = EVENT_COLORS[event.colorIndex] || EVENT_COLORS[0];
  const top = (event.startHour - START_HOUR + event.startMinute / 60) * HOUR_HEIGHT;
  const height = ((event.endHour - event.startHour) + (event.endMinute - event.startMinute) / 60) * HOUR_HEIGHT;

  const timeStr = `${formatTime(event.startHour, event.startMinute)} – ${formatTime(event.endHour, event.endMinute)}`;

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleTitleSubmit = () => {
    setEditing(false);
    const trimmed = title.trim();
    if (trimmed) {
      onUpdate(event.id, { title: trimmed });
    } else {
      setTitle(event.title);
    }
  };

  const handleMouseDown = useCallback((e) => {
    if (editing) return;
    if (e.target.classList.contains('event-resize-handle')) return;
    e.preventDefault();
    e.stopPropagation();
    onMoveStart(event, e);
  }, [event, editing, onMoveStart]);

  const handleResizeDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onResizeStart(event, e);
  }, [event, onResizeStart]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = blockRef.current.getBoundingClientRect();
    setShowColorPicker({ x: rect.right + 4, y: rect.top });
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleTitleSubmit();
    if (e.key === 'Escape') { setTitle(event.title); setEditing(false); }
  };

  const isShort = height < 36;

  return (
    <>
      <div
        ref={blockRef}
        className={`event-block ${isShort ? 'event-block--short' : ''}`}
        style={{
          top: `${top}px`,
          height: `${Math.max(height, 18)}px`,
          backgroundColor: color.bg,
          borderLeft: `3px solid ${color.border}`,
          color: color.text,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <div className="event-content">
          {editing ? (
            <input
              ref={inputRef}
              className="event-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              style={{ color: color.text }}
            />
          ) : (
            <span className="event-title">{event.title}</span>
          )}
          {!isShort && <span className="event-time">{timeStr}</span>}
        </div>
        <button
          className="event-delete"
          onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
          title="remove"
        >
          ×
        </button>
        <div
          className="event-resize-handle"
          onMouseDown={handleResizeDown}
        />
      </div>
      {showColorPicker && (
        <div style={{ position: 'fixed', left: showColorPicker.x, top: showColorPicker.y, zIndex: 1001 }}>
          <ColorPicker
            selectedIndex={event.colorIndex}
            onSelect={(i) => onUpdate(event.id, { colorIndex: i })}
            onClose={() => setShowColorPicker(false)}
          />
        </div>
      )}
    </>
  );
}
