import Header from './components/Header';
import CalendarGrid from './components/CalendarGrid';
import { useEvents } from './hooks/useEvents';
import { useWeekNavigation } from './hooks/useWeekNavigation';

function App() {
  const { events, addEvent, updateEvent, deleteEvent, moveEvent, resizeEvent } = useEvents();
  const { weekDates, weekLabel, goToPrevWeek, goToNextWeek, goToThisWeek, isThisWeek } = useWeekNavigation();

  return (
    <>
      <Header
        weekLabel={weekLabel}
        onPrev={goToPrevWeek}
        onNext={goToNextWeek}
        onToday={goToThisWeek}
        isThisWeek={isThisWeek}
      />
      <CalendarGrid
        events={events}
        weekDates={weekDates}
        onAddEvent={addEvent}
        onUpdateEvent={updateEvent}
        onDeleteEvent={deleteEvent}
        onMoveEvent={moveEvent}
        onResizeEvent={resizeEvent}
      />
    </>
  );
}

export default App;
