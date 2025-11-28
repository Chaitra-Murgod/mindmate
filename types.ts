
export interface GardenTree {
  leafColor: string;     // Hex color or Tailwind class
  health: 'blooming' | 'drooping' | 'shedding';
  flowerCount: number;
  summary: string;       // Short description of the tree state
}

export type SkyWeather = 'sunny' | 'cloudy' | 'partly-cloudy' | 'rainy' | 'stormy' | 'sunset' | 'night' | 'rainbow';

export interface GardenPage {
  title: string;
  content: string;
  type: 'morning' | 'sky' | 'energy' | 'uplift' | 'guidance';
  tags?: string[];       // For Uplift Moments
  energyLevel?: number;  // For Energy Page (0-100)
  skyWeather?: SkyWeather; // For Sky Page
}

export interface EmotionArchitecture {
  tree: GardenTree;
  pages: GardenPage[];
}

export interface Neuroloop {
  title: string;
  steps: string[];
  duration: string;
}

export interface DayEvent {
  time: string;
  activity: string;
  icon: string;
  mood?: string;
}

export interface DayCorrection {
  issue: string;
  fix: string;
}

// Keep for backward compatibility if needed, but not used in new profile
export interface DayBalancer {
  current: DayEvent[];
  healthy: DayEvent[];
  corrections: DayCorrection[];
  summary: string;
}

// --- Graph Types ---

export interface DailyGraphItem {
  label: string; // e.g., "Happy", "Sad", "Calm"
  value: number; // 0-100
}

export interface WeeklyGraphItem {
  day: string;   // e.g., "Mon"
  score: number; // 0-100
  mood: string;  // e.g., "Calm"
}

export interface EmotionResponse {
  architecture: EmotionArchitecture;
  reply: string;
  neuroloop: Neuroloop;
  vibeForecast: string;
  dailyGraph: DailyGraphItem[]; // New: For Home Screen Top-Right
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string | EmotionResponse; // User is string, Model is structured object
  timestamp: number;
}

export type Language = 'english' | 'hindi' | 'kannada';

export interface User {
  name: string;
  contact: string;
}

// --- New Profile Dashboard Types ---

export interface ProfileOverview {
  moodSummary: string; // "Calm but tired"
  energyLevel: number; // 0-100
  caption: string;     // One-line emotional caption
  stats: { label: string; value: number }[]; // e.g., Happiness: 60, Stress: 20
}

export interface ProfileTimelineItem {
  time: string;
  activity: string;
  icon: string;
}

export interface ProfileRoutine {
  schedule: ProfileTimelineItem[];
  motivation: string;
}

export interface ProfileMistake {
  slipUp: string;
  correction: string;
}

export interface ProfileSummary {
  wentWell: string;
  tryTomorrow: string;
}

export interface ProfileArchive {
  overview: ProfileOverview;
  timetable: ProfileTimelineItem[];
  improvements: string[];
  healthyRoutine: ProfileRoutine;
  mistakes: ProfileMistake[];
  dailySummary: ProfileSummary;
  weeklyGraph: WeeklyGraphItem[]; // New: For Profile Summary
  graphInsights: string[];        // New: Insights for the graph
}
