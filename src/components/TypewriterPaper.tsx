import React, { useState } from 'react';
import { Task, RibbonColor, Priority, Category, FilterOption } from '../types';
import { typewriterAudio } from '../audio/typewriterAudio';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Edit3, Save, X, Calendar, AlertCircle, Bookmark, Tag, Plus, Settings2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TypewriterPaperProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, text: string, priority: Priority, category: Category) => void;
  filter: FilterOption;
  setFilter: (filter: FilterOption) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  ribbonColor: RibbonColor;
  tags: string[];
  onOpenTagManager: () => void;
  onAddTag: (tagName: string) => boolean;
}

export const TypewriterPaper: React.FC<TypewriterPaperProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  filter,
  setFilter,
  selectedCategory,
  setSelectedCategory,
  ribbonColor,
  tags,
  onOpenTagManager,
  onAddTag,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('normal');
  const [editCategory, setEditCategory] = useState<Category>('General');

  // Format today's date in classic vintage typewriter format
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date()).toUpperCase();

  const handleStartEdit = (task: Task) => {
    typewriterAudio.playKeyClick(1);
    setEditingId(task.id);
    setEditText(task.text);
    setEditPriority(task.priority);
    setEditCategory(task.category);
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;
    typewriterAudio.playStamp();
    onUpdateTask(id, editText.trim(), editPriority, editCategory);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    typewriterAudio.playBackspace();
    setEditingId(null);
  };

  const handleToggle = (task: Task) => {
    if (!task.completed) {
      typewriterAudio.playStamp();
      confetti({
        particleCount: 28,
        spread: 50,
        origin: { y: 0.55 },
        colors: ['#b91c1c', '#ca8a04', '#1e293b', '#e2e8f0'],
      });
    } else {
      typewriterAudio.playBackspace();
    }
    onToggleTask(task.id);
  };

  const handleDelete = (id: string) => {
    typewriterAudio.playPaperTear();
    onDeleteTask(id);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (selectedCategory !== 'ALL' && task.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div
      id="typewriter-paper-sheet"
      className="paper-texture paper-grain relative mx-auto w-full max-w-2xl rounded-t-sm shadow-2xl transition-all duration-300 border-x border-t border-amber-900/20"
      style={{
        minHeight: '480px',
      }}
    >
      {/* Red vertical margin guide line typical of vintage legal/stationery paper */}
      <div
        className="absolute top-0 bottom-0 left-12 sm:left-16 w-[1.5px] bg-red-400/40 pointer-events-none z-10"
        title="Margin rule"
      />

      {/* Top Paper Header Area */}
      <div className="pt-8 pb-4 px-6 sm:px-12 border-b border-amber-900/15 relative">
        {/* Subtle vintage serial number & date stamp */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-courier text-amber-950/60 uppercase tracking-widest mb-3">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="inline-block w-2 h-2 rounded-full border border-amber-900/40 bg-amber-900/20" />
            <span>MEMO REF: #8492-TTD</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 opacity-70" />
            <span className="font-bold tracking-wider">{todayFormatted}</span>
          </div>
        </div>

        {/* The Big Prominent Stamped Heading: "TO-DO" */}
        <div className="text-center my-3 relative">
          <div className="inline-block relative">
            <h1
              id="paper-main-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-typewriter font-bold tracking-[0.25em] text-neutral-900 ink-text select-none uppercase px-4 py-1.5"
            >
              — T O - D O —
            </h1>
            <div className="h-[2px] w-full bg-neutral-900/80 mx-auto mt-1 opacity-80" />
            <div className="h-[1px] w-4/5 bg-neutral-900/50 mx-auto mt-0.5" />
          </div>
          <p className="font-typewriter text-xs text-amber-950/70 tracking-widest mt-2 uppercase">
            [ DAILY SCHEDULE & OPERATIONAL ASSIGNMENTS ]
          </p>
        </div>

        {/* Filter & Category Ribbon Bar */}
        <div className="mt-4 pt-3 border-t border-dashed border-amber-900/20 flex flex-wrap items-center justify-between gap-2 text-xs font-courier">
          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1 bg-amber-900/10 p-0.5 rounded border border-amber-900/20">
            <button
              id="filter-all-btn"
              onClick={() => {
                typewriterAudio.playKeyClick();
                setFilter('all');
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors font-bold ${
                filter === 'all'
                  ? 'bg-neutral-900 text-amber-50 shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              ALL ({totalCount})
            </button>
            <button
              id="filter-active-btn"
              onClick={() => {
                typewriterAudio.playKeyClick();
                setFilter('active');
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors font-bold ${
                filter === 'active'
                  ? 'bg-neutral-900 text-amber-50 shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              PENDING ({activeCount})
            </button>
            <button
              id="filter-completed-btn"
              onClick={() => {
                typewriterAudio.playKeyClick();
                setFilter('completed');
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors font-bold ${
                filter === 'completed'
                  ? 'bg-neutral-900 text-amber-50 shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              DONE ({completedCount})
            </button>
          </div>

          {/* Category Filter Ribbon with prominent Add & Manage Tag Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            <Tag className="w-3.5 h-3.5 text-amber-900/60 shrink-0" />
            
            {/* ALL Filter */}
            <button
              onClick={() => {
                typewriterAudio.playKeyClick();
                setSelectedCategory('ALL');
              }}
              className={`px-2 py-0.5 text-[11px] rounded uppercase font-typewriter transition-all ${
                selectedCategory === 'ALL'
                  ? 'border-b-2 border-neutral-900 font-bold text-neutral-950 bg-amber-900/15'
                  : 'text-neutral-600 hover:text-neutral-900 opacity-70 hover:opacity-100'
              }`}
            >
              ALL
            </button>

            {/* Dynamic Tags */}
            {tags.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  typewriterAudio.playKeyClick();
                  setSelectedCategory(cat);
                }}
                className={`px-2 py-0.5 text-[11px] rounded uppercase font-typewriter transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'border-b-2 border-neutral-900 font-bold text-neutral-950 bg-amber-900/15'
                    : 'text-neutral-600 hover:text-neutral-900 opacity-70 hover:opacity-100'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Direct "+ TAG" and "⚙️ EDIT" buttons */}
            <button
              onClick={() => {
                typewriterAudio.playKeyClick();
                onOpenTagManager();
              }}
              className="flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold font-courier uppercase text-amber-900 hover:text-amber-950 bg-amber-900/10 hover:bg-amber-900/20 border border-amber-900/30 rounded cursor-pointer transition-colors shrink-0"
              title="Add or Edit Tags"
            >
              <Plus className="w-3 h-3" />
              <span>TAG</span>
            </button>

            <button
              onClick={() => {
                typewriterAudio.playKeyClick();
                onOpenTagManager();
              }}
              className="p-1 text-amber-900/70 hover:text-amber-950 hover:bg-amber-900/15 rounded cursor-pointer transition-colors shrink-0"
              title="Open Tag Registry & Management"
            >
              <Settings2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="p-4 sm:p-8 pl-14 sm:pl-20 relative min-h-[320px]">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-600 font-typewriter select-none">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-900/30 flex items-center justify-center mb-3 text-amber-900/50">
              <Bookmark className="w-6 h-6" />
            </div>
            <p className="text-sm uppercase tracking-wider text-neutral-800 font-bold">
              {filter === 'completed'
                ? 'NO COMPLETED ASSIGNMENTS YET'
                : filter === 'active'
                ? 'ALL CURRENT ASSIGNMENTS COMPLETED'
                : 'NO ENTRIES ON THIS SHEET'}
            </p>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
              Use the typewriter keyboard or input carriage below to type and strike new tasks onto this sheet.
            </p>
          </div>
        ) : (
          <ul className="space-y-3 font-typewriter">
            <AnimatePresence initial={false}>
              {filteredTasks.map((task, index) => {
                const isEditing = editingId === task.id;

                return (
                  <motion.li
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.15 } }}
                    className={`group relative rounded px-2.5 py-1.5 transition-all duration-150 border ${
                      task.completed
                        ? 'bg-amber-900/5 border-transparent text-neutral-500'
                        : 'bg-amber-50/50 hover:bg-amber-100/60 border-amber-900/10 shadow-xs'
                    }`}
                  >
                    {isEditing ? (
                      /* In-line Task Editing Mode */
                      <div className="space-y-2 p-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => {
                              typewriterAudio.playKeyClick();
                              setEditText(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(task.id);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            autoFocus
                            className="w-full bg-white/90 border border-neutral-800 px-2 py-1 text-sm font-typewriter rounded text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-900"
                          />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <select
                              value={editPriority}
                              onChange={(e) => setEditPriority(e.target.value as Priority)}
                              className="bg-white/80 border border-amber-900/30 rounded px-1.5 py-0.5 text-xs font-courier"
                            >
                              <option value="low">LOW PRIORITY</option>
                              <option value="normal">NORMAL</option>
                              <option value="urgent">URGENT</option>
                            </select>

                            <select
                              value={editCategory}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === '__MANAGE__') {
                                  onOpenTagManager();
                                } else {
                                  setEditCategory(val);
                                }
                              }}
                              className="bg-white/80 border border-amber-900/30 rounded px-1.5 py-0.5 text-xs font-courier"
                            >
                              {tags.map((t) => (
                                <option key={t} value={t}>
                                  {t.toUpperCase()}
                                </option>
                              ))}
                              <option value="__MANAGE__">⚙️ MANAGE / + TAGS...</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSaveEdit(task.id)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-neutral-900 text-amber-50 rounded text-xs hover:bg-neutral-800 font-courier cursor-pointer"
                            >
                              <Save className="w-3 h-3" /> SAVE
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center gap-1 px-2.5 py-1 bg-neutral-300 text-neutral-800 rounded text-xs hover:bg-neutral-400 font-courier cursor-pointer"
                            >
                              <X className="w-3 h-3" /> CANCEL
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Normal Display Mode */
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          {/* Authentic mechanical bracket checkbox */}
                          <button
                            id={`task-toggle-${task.id}`}
                            onClick={() => handleToggle(task)}
                            className="mt-0.5 select-none shrink-0 font-courier font-bold text-sm tracking-tight text-neutral-800 hover:text-amber-900 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                            title={task.completed ? 'Mark incomplete' : 'Mark complete [Stamp]'}
                          >
                            <span className="text-neutral-500 font-bold">[</span>
                            <span
                              className={`w-4 text-center font-bold ${
                                task.completed
                                  ? 'text-red-700 ink-text-red scale-110 inline-block transform -rotate-6'
                                  : 'text-transparent'
                              }`}
                            >
                              {task.completed ? 'X' : ' '}
                            </span>
                            <span className="text-neutral-500 font-bold">]</span>
                          </button>

                          {/* Task Text with typewriter overstrike effect */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="text-xs font-courier text-neutral-400 select-none">
                                {String(index + 1).padStart(2, '0')}.
                              </span>
                              <span
                                className={`text-sm sm:text-base leading-relaxed break-words font-typewriter tracking-wide ${
                                  task.completed
                                    ? 'line-through decoration-red-700/80 decoration-[2px] text-neutral-500 italic'
                                    : 'text-neutral-900 ink-text font-medium'
                                }`}
                              >
                                {task.text}
                              </span>
                            </div>

                            {/* Tags, stamps, and timestamp */}
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-courier">
                              {/* Category Stamp (Clickable to filter by tag or manage) */}
                              <button
                                onClick={() => {
                                  typewriterAudio.playKeyClick();
                                  setSelectedCategory(task.category);
                                }}
                                className="border border-amber-900/30 hover:border-amber-900/60 px-1.5 py-0.2 rounded text-neutral-700 hover:text-neutral-950 bg-amber-900/5 hover:bg-amber-900/10 uppercase text-[10px] tracking-wider transition-colors cursor-pointer"
                                title={`Filter by tag: ${task.category}`}
                              >
                                🏷️ {task.category}
                              </button>

                              {/* Priority Stamp */}
                              {task.priority === 'urgent' && (
                                <span className="border border-red-700/60 bg-red-700/10 text-red-800 px-1.5 py-0.2 rounded font-bold uppercase text-[10px] tracking-widest flex items-center gap-1 ink-text-red">
                                  <AlertCircle className="w-2.5 h-2.5" /> URGENT
                                </span>
                              )}
                              {task.priority === 'low' && (
                                <span className="border border-neutral-400/50 text-neutral-600 px-1.5 py-0.2 rounded uppercase text-[10px]">
                                  LOW
                                </span>
                              )}

                              {/* Timestamp */}
                              <span className="text-neutral-400 text-[10px]">
                                {new Date(task.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Hover Action Buttons */}
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            id={`task-edit-${task.id}`}
                            onClick={() => handleStartEdit(task)}
                            className="p-1 text-neutral-600 hover:text-neutral-950 hover:bg-amber-900/10 rounded transition-colors cursor-pointer"
                            title="Edit task text, tag, or priority"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`task-delete-${task.id}`}
                            onClick={() => handleDelete(task.id)}
                            className="p-1 text-neutral-500 hover:text-red-700 hover:bg-red-700/10 rounded transition-colors cursor-pointer"
                            title="Rip off / Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Paper bottom tear-off perforations & subtle watermark */}
      <div className="px-6 sm:px-12 py-3 border-t border-amber-900/15 flex items-center justify-between text-[10px] font-courier text-amber-950/50 uppercase tracking-widest select-none">
        <span>— END OF TRANSMISSION —</span>
        <div className="flex items-center gap-3">
          <span>
            {completedCount}/{totalCount} COMPLETED
          </span>
          <span className="font-bold text-amber-950/70">ROYAL ARCHIVE</span>
        </div>
      </div>
    </div>
  );
};
