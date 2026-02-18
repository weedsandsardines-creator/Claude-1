import { EVENT_COLORS } from '../constants';
import './ColorPicker.css';

export default function ColorPicker({ selectedIndex, onSelect, onClose }) {
  return (
    <div className="color-picker-overlay" onClick={onClose}>
      <div className="color-picker" onClick={(e) => e.stopPropagation()}>
        <div className="color-picker-grid">
          {EVENT_COLORS.map((color, i) => (
            <button
              key={color.name}
              className={`color-dot ${i === selectedIndex ? 'active' : ''}`}
              style={{ background: color.bg, borderColor: color.border }}
              onClick={() => { onSelect(i); onClose(); }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
