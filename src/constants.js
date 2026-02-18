export const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const DAY_LABELS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export const START_HOUR = 6;
export const END_HOUR = 21; // 9pm

export const HOUR_HEIGHT = 52; // px per hour

export const EVENT_COLORS = [
  { name: 'lavender',   bg: '#e8e0ff', text: '#5b4a9e', border: '#d4c8ff' },
  { name: 'rose',       bg: '#ffe0e6', text: '#9e4a5b', border: '#ffc8d4' },
  { name: 'peach',      bg: '#ffe5d0', text: '#9e6b4a', border: '#ffd4b8' },
  { name: 'sunshine',   bg: '#fff3d0', text: '#8a7a3a', border: '#ffe8a8' },
  { name: 'mint',       bg: '#d5f5e3', text: '#3a7a5b', border: '#b8ebd0' },
  { name: 'sky',        bg: '#d0eeff', text: '#3a6a8a', border: '#b8e0ff' },
  { name: 'cloud',      bg: '#f0eeeb', text: '#6a6560', border: '#e0ddd8' },
  { name: 'coral',      bg: '#ffd6cc', text: '#994433', border: '#ffc4b5' },
  { name: 'lilac',      bg: '#f0d5ff', text: '#7a3a9e', border: '#e4c0ff' },
  { name: 'sage',       bg: '#ddeedd', text: '#4a6a4a', border: '#c8ddc8' },
];

export const INSPIRATIONS = [
  "you've got this",
  "one beautiful week ahead",
  "make it count",
  "breathe & begin",
  "your week, your story",
  "small steps, big life",
  "be gentle with yourself",
  "today is a good day",
];

export const DEFAULT_EVENTS = [
  {
    id: '1',
    title: 'morning walk',
    day: 1,
    startHour: 7,
    startMinute: 0,
    endHour: 8,
    endMinute: 0,
    colorIndex: 4,
  },
  {
    id: '2',
    title: 'deep work',
    day: 1,
    startHour: 9,
    startMinute: 0,
    endHour: 12,
    endMinute: 0,
    colorIndex: 0,
  },
  {
    id: '3',
    title: 'lunch with a friend',
    day: 2,
    startHour: 12,
    startMinute: 0,
    endHour: 13,
    endMinute: 30,
    colorIndex: 3,
  },
  {
    id: '4',
    title: 'yoga',
    day: 3,
    startHour: 17,
    startMinute: 0,
    endHour: 18,
    endMinute: 0,
    colorIndex: 1,
  },
  {
    id: '5',
    title: 'creative time',
    day: 4,
    startHour: 14,
    startMinute: 0,
    endHour: 16,
    endMinute: 0,
    colorIndex: 8,
  },
  {
    id: '6',
    title: 'grocery run',
    day: 5,
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 0,
    colorIndex: 2,
  },
  {
    id: '7',
    title: 'movie night',
    day: 6,
    startHour: 19,
    startMinute: 0,
    endHour: 21,
    endMinute: 0,
    colorIndex: 5,
  },
];
