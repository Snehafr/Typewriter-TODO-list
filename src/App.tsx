/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Task, Priority, Category, RibbonColor, TypewriterTheme, FilterOption } from './types';
import { TypewriterFrame } from './components/TypewriterFrame';
import { TypewriterPaper } from './components/TypewriterPaper';
import { TaskInput } from './components/TaskInput';
import { TypewriterKeyboard } from './components/TypewriterKeyboard';
import { TagManagerModal } from './components/TagManagerModal';
import { typewriterAudio } from './audio/typewriterAudio';

const STORAGE_KEY_TASKS = 'typewriter_todo_tasks_v1';
const STORAGE_KEY_THEME = 'typewriter_todo_theme_v1';
const STORAGE_KEY_RIBBON = 'typewriter_todo_ribbon_v1';
const STORAGE_KEY_TAGS = 'typewriter_todo_tags_v1';

const DEFAULT_TAGS: string[] = ['General', 'Work', 'Personal', 'Ideas', 'Urgent'];

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    text: 'Inspect mechanical platen roller & escapement springs',
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 45,
    priority: 'urgent',
    category: 'Work',
  },
  {
    id: 'task-2',
    text: 'Purchase dual-tone Black / Crimson Red typewriter ribbon',
    completed: true,
    createdAt: Date.now() - 1000 * 60 * 120,
    completedAt: Date.now() - 1000 * 60 * 10,
    priority: 'normal',
    category: 'General',
  },
  {
    id: 'task-3',
    text: 'File morning dispatch telegram to headquarters',
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 20,
    priority: 'normal',
    category: 'Work',
  },
];

export default function App() {
  // Tasks state with localStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_TASKS;
  });

  // Dynamic tags registry state with persistence
  const [tags, setTags] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TAGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_TAGS;
  });

  // Tag manager modal open state
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);

  // Typewriter Theme
  const [theme, setTheme] = useState<TypewriterTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved) return saved as TypewriterTheme;
    } catch {
      // ignore
    }
    return 'vintage-green';
  });

  // Ribbon Color (Black / Red)
  const [ribbonColor, setRibbonColor] = useState<RibbonColor>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RIBBON);
      if (saved) return saved as RibbonColor;
    } catch {
      // ignore
    }
    return 'black';
  });

  // Filters
  const [filter, setFilter] = useState<FilterOption>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Animation and typing feedback states
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isStriking, setIsStriking] = useState(false);

  // Save tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  // Save tags to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(tags));
    } catch {
      // ignore
    }
  }, [tags]);

  // Save theme
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Save ribbon color
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RIBBON, ribbonColor);
    } catch {
      // ignore
    }
  }, [ribbonColor]);

  // Tag operations
  const handleAddTag = useCallback((newTagName: string): boolean => {
    const trimmed = newTagName.trim();
    if (!trimmed) return false;
    
    // Check if tag already exists (case-insensitive)
    const exists = tags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;

    setTags((prev) => [...prev, trimmed]);
    return true;
  }, [tags]);

  const handleEditTag = useCallback((oldTagName: string, newTagName: string): boolean => {
    const trimmed = newTagName.trim();
    if (!trimmed) return false;

    // If only case changed on same tag, allow it; else check if target name exists
    const exists = tags.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase() && t.toLowerCase() !== oldTagName.toLowerCase()
    );
    if (exists) return false;

    // Update tags list
    setTags((prev) => prev.map((t) => (t.toLowerCase() === oldTagName.toLowerCase() ? trimmed : t)));

    // Re-stamp all existing tasks with this tag
    setTasks((prev) =>
      prev.map((task) =>
        task.category.toLowerCase() === oldTagName.toLowerCase()
          ? { ...task, category: trimmed }
          : task
      )
    );

    // Update filter if currently selected
    if (selectedCategory.toLowerCase() === oldTagName.toLowerCase()) {
      setSelectedCategory(trimmed);
    }

    return true;
  }, [tags, selectedCategory]);

  const handleDeleteTag = useCallback((tagName: string) => {
    // Cannot delete General
    if (tagName.toLowerCase() === 'general') return;

    setTags((prev) => prev.filter((t) => t.toLowerCase() !== tagName.toLowerCase()));

    // Reassign affected tasks to 'General'
    setTasks((prev) =>
      prev.map((task) =>
        task.category.toLowerCase() === tagName.toLowerCase()
          ? { ...task, category: 'General' }
          : task
      )
    );

    // Reset filter if needed
    if (selectedCategory.toLowerCase() === tagName.toLowerCase()) {
      setSelectedCategory('ALL');
    }
  }, [selectedCategory]);

  // Add new task
  const handleAddTask = useCallback(
    (text: string, priority: Priority, category: Category, currentRibbon: RibbonColor) => {
      const newTask: Task = {
        id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        text,
        completed: false,
        createdAt: Date.now(),
        priority,
        category,
        strikeColor: currentRibbon,
      };

      setTasks((prev) => [newTask, ...prev]);
    },
    []
  );

  // Toggle task completion
  const handleToggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? Date.now() : undefined,
            }
          : t
      )
    );
  }, []);

  // Delete task
  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Update existing task
  const handleUpdateTask = useCallback(
    (id: string, text: string, priority: Priority, category: Category) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text, priority, category } : t))
      );
    },
    []
  );

  // Clear completed tasks
  const handleClearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  // On-screen keyboard interactions
  const handleKeyboardChar = (char: string) => {
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 90);

    const inputEl = document.getElementById('typewriter-task-input') as HTMLInputElement | null;
    if (inputEl) {
      inputEl.value += char;
      // Trigger onChange event
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      inputEl.focus();
    }
  };

  const handleKeyboardEnter = () => {
    const returnBtn = document.getElementById('strike-return-btn');
    if (returnBtn) {
      returnBtn.click();
    }
  };

  const handleKeyboardBackspace = () => {
    const inputEl = document.getElementById('typewriter-task-input') as HTMLInputElement | null;
    if (inputEl && inputEl.value.length > 0) {
      inputEl.value = inputEl.value.slice(0, -1);
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      inputEl.focus();
    }
  };

  const handleKeyboardSpace = () => {
    handleKeyboardChar(' ');
  };

  const handleToggleRibbon = () => {
    setRibbonColor((prev) => (prev === 'black' ? 'red' : 'black'));
  };

  const handleCarriageReturnLever = () => {
    const returnBtn = document.getElementById('strike-return-btn');
    if (returnBtn) {
      returnBtn.click();
    }
  };

  const handlePaperScrollUp = () => {
    const paperEl = document.getElementById('typewriter-paper-sheet');
    if (paperEl) {
      paperEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handlePaperScrollDown = () => {
    const inputEl = document.getElementById('typewriter-task-input');
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-[#141416] bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] text-neutral-100 flex flex-col items-center justify-start pb-12 selection:bg-amber-900/50 selection:text-amber-200">
      <TypewriterFrame
        theme={theme}
        setTheme={setTheme}
        ribbonColor={ribbonColor}
        onCarriageReturn={handleCarriageReturnLever}
        onPaperScrollUp={handlePaperScrollUp}
        onPaperScrollDown={handlePaperScrollDown}
        onClearCompleted={handleClearCompleted}
        isStriking={isStriking}
        tasksCount={{
          total: tasks.length,
          active: activeCount,
          completed: completedCount,
        }}
        onOpenTagManager={() => setIsTagManagerOpen(true)}
      >
        {/* The Vintage Paper Sheet with " TO-DO " Header */}
        <TypewriterPaper
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
          filter={filter}
          setFilter={setFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          ribbonColor={ribbonColor}
          tags={tags}
          onOpenTagManager={() => setIsTagManagerOpen(true)}
          onAddTag={handleAddTag}
        />

        {/* The Typing Carriage / Task Input Strike Unit */}
        <TaskInput
          onAddTask={handleAddTask}
          ribbonColor={ribbonColor}
          setRibbonColor={setRibbonColor}
          activeKey={activeKey}
          setActiveKey={setActiveKey}
          isStriking={isStriking}
          setIsStriking={setIsStriking}
          tags={tags}
          onOpenTagManager={() => setIsTagManagerOpen(true)}
          onAddTag={handleAddTag}
        />

        {/* The Circular Vintage Typewriter Keyboard */}
        <TypewriterKeyboard
          onKeyPress={handleKeyboardChar}
          onEnter={handleKeyboardEnter}
          onBackspace={handleKeyboardBackspace}
          onSpace={handleKeyboardSpace}
          activeKey={activeKey}
          ribbonColor={ribbonColor}
          onToggleRibbon={handleToggleRibbon}
        />
      </TypewriterFrame>

      {/* Tag Registry & Stamper Modal */}
      <TagManagerModal
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        tags={tags}
        tasks={tasks}
        onAddTag={handleAddTag}
        onEditTag={handleEditTag}
        onDeleteTag={handleDeleteTag}
      />
    </main>
  );
}
