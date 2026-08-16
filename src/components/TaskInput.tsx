import React, { useState, useRef } from 'react';
import { Priority, Category, RibbonColor } from '../types';
import { typewriterAudio } from '../audio/typewriterAudio';
import { CornerDownLeft, Tag, Bell, Plus, Settings2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskInputProps {
  onAddTask: (text: string, priority: Priority, category: Category, ribbonColor: RibbonColor) => void;
  ribbonColor: RibbonColor;
  setRibbonColor: (color: RibbonColor) => void;
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
  isStriking: boolean;
  setIsStriking: (striking: boolean) => void;
  tags: string[];
  onOpenTagManager: () => void;
  onAddTag: (tagName: string) => boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  onAddTask,
  ribbonColor,
  setRibbonColor,
  activeKey,
  setActiveKey,
  isStriking,
  setIsStriking,
  tags,
  onOpenTagManager,
  onAddTag,
}) => {
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [category, setCategory] = useState<Category>('General');
  const [isQuickAddingTag, setIsQuickAddingTag] = useState(false);
  const [quickTagName, setQuickTagName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const quickTagRef = useRef<HTMLInputElement>(null);

  const triggerStrikeAnimation = () => {
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 90);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    setActiveKey(key.toUpperCase());
    setTimeout(() => setActiveKey(null), 120);

    if (key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (key === ' ') {
      typewriterAudio.playSpace();
      triggerStrikeAnimation();
    } else if (key === 'Backspace') {
      typewriterAudio.playBackspace();
    } else if (key.length === 1) {
      // Normal typed character
      typewriterAudio.playKeyClick();
      triggerStrikeAnimation();
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim()) {
      typewriterAudio.playBell();
      return;
    }

    // Play carriage return sound (slide + ding bell!)
    typewriterAudio.playCarriageReturn();
    triggerStrikeAnimation();

    onAddTask(inputText.trim(), priority, category, ribbonColor);
    setInputText('');

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRingBell = () => {
    typewriterAudio.playBell();
  };

  const handleQuickAddSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = quickTagName.trim();
    if (!trimmed) {
      setIsQuickAddingTag(false);
      return;
    }

    const success = onAddTag(trimmed);
    if (success) {
      typewriterAudio.playStamp();
      setCategory(trimmed);
      setQuickTagName('');
      setIsQuickAddingTag(false);
      if (inputRef.current) inputRef.current.focus();
    } else {
      typewriterAudio.playBell();
      setCategory(trimmed);
      setIsQuickAddingTag(false);
    }
  };

  return (
    <div id="typewriter-task-input-section" className="w-full max-w-2xl mx-auto my-2">
      {/* Mechanical Platen Guide / Ribbon Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-neutral-900/90 text-amber-100 rounded-t-md border-t border-x border-neutral-700/60 text-xs font-courier">
        <div className="flex items-center gap-2">
          {/* Ribbon Selector Switch */}
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-neutral-700">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">RIBBON:</span>
            <button
              id="ribbon-black-btn"
              type="button"
              onClick={() => {
                typewriterAudio.playKeyClick();
                setRibbonColor('black');
              }}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-all font-bold ${
                ribbonColor === 'black'
                  ? 'bg-neutral-800 text-white shadow-xs border border-neutral-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Classic Black Ink Ribbon"
            >
              <span className="w-2 h-2 rounded-full bg-black border border-neutral-400 inline-block" />
              BLACK
            </button>
            <button
              id="ribbon-red-btn"
              type="button"
              onClick={() => {
                typewriterAudio.playKeyClick();
                setRibbonColor('red');
              }}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-all font-bold ${
                ribbonColor === 'red'
                  ? 'bg-red-950 text-red-300 shadow-xs border border-red-500'
                  : 'text-neutral-400 hover:text-red-400'
              }`}
              title="Crimson Red Accent Ribbon"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 border border-red-300 inline-block" />
              RED
            </button>
          </div>

          {/* Quick Bell button */}
          <button
            id="bell-ring-btn"
            onClick={handleRingBell}
            className="p-1 text-amber-400/80 hover:text-amber-300 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
            title="Ring Typewriter Bell (Ding!)"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Priority & Category Quick Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority */}
          <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-neutral-700">
            <span className="text-[10px] text-neutral-400 font-bold">PRIORITY:</span>
            <select
              value={priority}
              onChange={(e) => {
                typewriterAudio.playKeyClick();
                setPriority(e.target.value as Priority);
              }}
              className="bg-transparent text-amber-200 text-[11px] font-courier font-bold focus:outline-none cursor-pointer"
            >
              <option value="normal" className="bg-neutral-900 text-white">NORMAL</option>
              <option value="urgent" className="bg-neutral-900 text-red-400">URGENT</option>
              <option value="low" className="bg-neutral-900 text-neutral-300">LOW</option>
            </select>
          </div>

          {/* Category / Tag Selector with Direct Add & Edit Controls */}
          {isQuickAddingTag ? (
            <div className="flex items-center gap-1 bg-neutral-950 px-1.5 py-0.5 rounded border border-amber-500 shadow-sm animate-in fade-in">
              <span className="text-[10px] text-amber-400 font-bold">NEW:</span>
              <input
                ref={quickTagRef}
                type="text"
                value={quickTagName}
                onChange={(e) => setQuickTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleQuickAddSubmit();
                  } else if (e.key === 'Escape') {
                    setIsQuickAddingTag(false);
                  }
                }}
                placeholder="TAG NAME..."
                className="bg-transparent text-amber-100 text-[11px] font-courier uppercase font-bold focus:outline-none w-24"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleQuickAddSubmit()}
                className="p-0.5 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                title="Save & Select Tag"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setIsQuickAddingTag(false)}
                className="p-0.5 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                title="Cancel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-neutral-700">
              <Tag className="w-3 h-3 text-amber-400/80" />
              <span className="text-[10px] text-neutral-400 font-bold">TAG:</span>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '__ADD_NEW__') {
                    typewriterAudio.playKeyClick();
                    setIsQuickAddingTag(true);
                  } else if (val === '__MANAGE__') {
                    typewriterAudio.playKeyClick();
                    onOpenTagManager();
                  } else {
                    typewriterAudio.playKeyClick();
                    setCategory(val);
                  }
                }}
                className="bg-transparent text-amber-200 text-[11px] font-courier font-bold focus:outline-none cursor-pointer max-w-[110px]"
              >
                {tags.map((c) => (
                  <option key={c} value={c} className="bg-neutral-900 text-white">
                    {c.toUpperCase()}
                  </option>
                ))}
                <option disabled className="bg-neutral-900 text-neutral-500">──────────</option>
                <option value="__ADD_NEW__" className="bg-neutral-900 text-amber-400 font-bold">
                  ➕ + ADD NEW TAG...
                </option>
                <option value="__MANAGE__" className="bg-neutral-900 text-sky-400 font-bold">
                  ⚙️ MANAGE / EDIT TAGS...
                </option>
              </select>

              {/* Direct Quick-Add Button */}
              <button
                type="button"
                onClick={() => {
                  typewriterAudio.playKeyClick();
                  setIsQuickAddingTag(true);
                }}
                className="p-1 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                title="Quick Add New Tag"
              >
                <Plus className="w-3 h-3" />
              </button>

              {/* Direct Tag Manager Button */}
              <button
                type="button"
                onClick={() => {
                  typewriterAudio.playKeyClick();
                  onOpenTagManager();
                }}
                className="p-1 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                title="Manage / Rename / Delete Tags"
              >
                <Settings2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Input Row - Styled as Chrome/Metal Type Alignment Guide */}
      <div className="relative bg-neutral-950 p-2 sm:p-3 border-x border-b border-neutral-800 shadow-xl flex items-center gap-2">
        {/* Animated Central Typebar Strike Hammer Guide */}
        <div className="relative flex items-center justify-center w-8 h-8 shrink-0 bg-neutral-900 border border-neutral-700 rounded shadow-inner">
          <motion.div
            animate={isStriking ? { y: -6, scale: 1.2, rotate: [-10, 0] } : { y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.08 }}
            className={`w-2.5 h-4 rounded-t-sm border border-neutral-400 shadow-sm ${
              ribbonColor === 'red' ? 'bg-red-700' : 'bg-neutral-300'
            }`}
            title="Mechanical Typebar Hammer"
          />
          <div className="absolute inset-0 border border-neutral-700/50 pointer-events-none rounded" />
        </div>

        {/* Text Input Box */}
        <div className="relative flex-1">
          <input
            id="typewriter-task-input"
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="TYPE YOUR NEW ASSIGNMENT HERE (PRESS ENTER TO STRIKE & ADVANCE)..."
            className={`w-full bg-neutral-900 border border-neutral-700/80 px-3 sm:px-4 py-2.5 rounded text-sm sm:text-base font-typewriter tracking-wider text-amber-100 placeholder:text-neutral-500 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/70 focus:border-amber-500/70 shadow-inner ${
              ribbonColor === 'red' ? 'text-red-400' : 'text-amber-100'
            }`}
          />
          {inputText && (
            <span className="absolute right-3 top-2.5 text-[10px] font-courier text-neutral-500 select-none">
              {inputText.length} CH
            </span>
          )}
        </div>

        {/* Carriage Return / Strike Lever Action Button */}
        <button
          id="strike-return-btn"
          type="button"
          onClick={handleSubmit}
          className="group flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded bg-linear-to-b from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 border border-amber-500/50 shadow-md font-courier font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer shrink-0 select-none"
          title="Strike Task onto Paper & Advance Carriage (Enter)"
        >
          <span>TYPE</span>
          <CornerDownLeft className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
