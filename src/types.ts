export type Priority = 'low' | 'normal' | 'urgent';

export type Category = string;

export type RibbonColor = 'black' | 'red';

export type TypewriterTheme = 'vintage-green' | 'matte-black' | 'burgundy' | 'teal' | 'cream';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  priority: Priority;
  category: Category;
  notes?: string;
  strikeColor?: RibbonColor;
}

export type FilterOption = 'all' | 'active' | 'completed';

export interface TypewriterSettings {
  soundEnabled: boolean;
  volume: number; // 0 to 1
  theme: TypewriterTheme;
  ribbonColor: RibbonColor;
  autoBellOnEnter: boolean;
  paperFeedOffset: number; // in pixels
}

