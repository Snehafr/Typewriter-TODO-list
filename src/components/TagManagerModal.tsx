import React, { useState } from 'react';
import { typewriterAudio } from '../audio/typewriterAudio';
import { Tag, Plus, Edit2, Trash2, Check, X, Bookmark, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';

interface TagManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  tasks: Task[];
  onAddTag: (tagName: string) => boolean;
  onEditTag: (oldName: string, newName: string) => boolean;
  onDeleteTag: (tagName: string) => void;
}

export const TagManagerModal: React.FC<TagManagerModalProps> = ({
  isOpen,
  onClose,
  tags,
  tasks,
  onAddTag,
  onEditTag,
  onDeleteTag,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editTagInput, setEditTagInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTagInput.trim();
    if (!trimmed) {
      setErrorMsg('Tag name cannot be blank.');
      typewriterAudio.playBell();
      return;
    }

    const success = onAddTag(trimmed);
    if (!success) {
      setErrorMsg(`Tag "${trimmed}" already exists.`);
      typewriterAudio.playBell();
    } else {
      typewriterAudio.playStamp();
      setNewTagInput('');
      setErrorMsg(null);
    }
  };

  const handleStartEditing = (tag: string) => {
    typewriterAudio.playKeyClick();
    setEditingTag(tag);
    setEditTagInput(tag);
    setErrorMsg(null);
  };

  const handleSaveEditing = (oldTag: string) => {
    const trimmed = editTagInput.trim();
    if (!trimmed) {
      setErrorMsg('Tag name cannot be empty.');
      typewriterAudio.playBell();
      return;
    }

    const success = onEditTag(oldTag, trimmed);
    if (!success) {
      setErrorMsg(`Tag "${trimmed}" already exists.`);
      typewriterAudio.playBell();
    } else {
      typewriterAudio.playStamp();
      setEditingTag(null);
      setErrorMsg(null);
    }
  };

  const handleCancelEditing = () => {
    typewriterAudio.playBackspace();
    setEditingTag(null);
    setErrorMsg(null);
  };

  const handleDelete = (tag: string) => {
    if (tag.toUpperCase() === 'GENERAL') {
      setErrorMsg('The default "General" tag cannot be deleted.');
      typewriterAudio.playBell();
      return;
    }
    typewriterAudio.playPaperTear();
    onDeleteTag(tag);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-neutral-900 border-2 border-amber-800/60 rounded-lg shadow-2xl overflow-hidden font-courier text-neutral-100"
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-950 border-b border-amber-900/40 text-amber-200">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <span className="font-bold tracking-wider text-sm">TAG REGISTRY & STAMPER</span>
          </div>
          <button
            onClick={() => {
              typewriterAudio.playBackspace();
              onClose();
            }}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Create New Tag */}
          <form onSubmit={handleCreate} className="space-y-2">
            <label className="text-xs font-bold text-amber-300 block tracking-wide uppercase">
              Type New Tag Name:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => {
                  setNewTagInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="e.g. PROJECT-X, FINANCE, STUDY..."
                className="flex-1 bg-neutral-950 border border-neutral-700 px-3 py-2 rounded text-sm text-amber-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 font-typewriter uppercase tracking-wider"
                autoFocus
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-2 bg-linear-to-b from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 border border-amber-500/50 rounded font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>STAMP</span>
              </button>
            </div>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-1.5 p-2 bg-red-950/60 border border-red-800/80 rounded text-red-300 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Existing Tags List */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-800 pb-1">
              <span>EXISTING TAGS ({tags.length})</span>
              <span>ACTIONS</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {tags.map((tag) => {
                const isEditingThis = editingTag === tag;
                const taskUsageCount = tasks.filter((t) => t.category.toLowerCase() === tag.toLowerCase()).length;
                const isDefault = tag.toLowerCase() === 'general';

                return (
                  <div
                    key={tag}
                    className="flex items-center justify-between gap-2 p-2 bg-neutral-950/70 border border-neutral-800 rounded hover:border-neutral-700 transition-colors"
                  >
                    {isEditingThis ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={editTagInput}
                          onChange={(e) => setEditTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveEditing(tag);
                            } else if (e.key === 'Escape') {
                              handleCancelEditing();
                            }
                          }}
                          className="flex-1 bg-neutral-900 border border-amber-600 px-2 py-1 rounded text-xs text-amber-100 uppercase font-typewriter focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEditing(tag)}
                          className="p-1 bg-emerald-900 text-emerald-200 hover:bg-emerald-800 border border-emerald-600 rounded cursor-pointer"
                          title="Save tag name"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleCancelEditing}
                          className="p-1 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-500/80 shrink-0" />
                          <span className="font-typewriter text-xs font-bold text-amber-100 uppercase tracking-wider truncate">
                            {tag}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-courier shrink-0">
                            ({taskUsageCount} {taskUsageCount === 1 ? 'task' : 'tasks'})
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Edit / Rename Tag Button */}
                          <button
                            onClick={() => handleStartEditing(tag)}
                            className="p-1 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                            title={`Rename tag "${tag}"`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Tag Button */}
                          {!isDefault && (
                            <button
                              onClick={() => handleDelete(tag)}
                              className="p-1 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                              title={`Delete tag "${tag}"`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-neutral-950 border-t border-amber-900/30 flex justify-between items-center text-[11px] text-neutral-400">
          <span>Editing a tag re-stamps all existing tasks.</span>
          <button
            onClick={() => {
              typewriterAudio.playStamp();
              onClose();
            }}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-200 border border-neutral-700 rounded font-bold cursor-pointer transition-colors"
          >
            DONE
          </button>
        </div>
      </motion.div>
    </div>
  );
};
