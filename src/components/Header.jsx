import { useMemo } from 'react';
import { INSPIRATIONS } from '../constants';
import './Header.css';

export default function Header({ weekLabel, onPrev, onNext, onToday, isThisWeek }) {
  const inspiration = useMemo(() => {
    return INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)];
  }, [weekLabel]);

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">my week</h1>
        <span className="header-inspiration">{inspiration}</span>
      </div>
      <div className="header-center">
        <button className="nav-btn" onClick={onPrev} aria-label="Previous week">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="header-week-label">{weekLabel}</span>
        <button className="nav-btn" onClick={onNext} aria-label="Next week">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {!isThisWeek && (
          <button className="today-btn" onClick={onToday}>today</button>
        )}
      </div>
      <div className="header-right">
        <span className="header-hint">click to add · drag to move · pull edges to resize</span>
      </div>
    </header>
  );
}
