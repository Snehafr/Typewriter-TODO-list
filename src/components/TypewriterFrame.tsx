import React, { useState } from 'react';
import { TypewriterTheme, RibbonColor } from '../types';
import { typewriterAudio } from '../audio/typewriterAudio';
import { Volume2, VolumeX, Sparkles, Printer, RotateCcw, HelpCircle, Palette, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface TypewriterFrameProps {
  children: React.ReactNode;
  theme: TypewriterTheme;
  setTheme: (theme: TypewriterTheme) => void;
  ribbonColor: RibbonColor;
  onCarriageReturn: () => void;
  onPaperScrollUp: () => void;
  onPaperScrollDown: () => void;
  onClearCompleted: () => void;
  isStriking: boolean;
  tasksCount: { total: number; active: number; completed: number };
  onOpenTagManager?: () => void;
}

export const TypewriterFrame: React.FC<TypewriterFrameProps> = ({
  children,
  theme,
  setTheme,
  ribbonColor,
  onCarriageReturn,
  onPaperScrollUp,
  onPaperScrollDown,
  onClearCompleted,
  isStriking,
  tasksCount,
  onOpenTagManager,
}) => {
  const [soundMuted, setSoundMuted] = useState(false);
  const [leverPulled, setLeverPulled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [brandName, setBrandName] = useState<'ROYAL' | 'SMITH-CORONA' | 'HERMES' | 'UNDERWOOD'>('HERMES');

  // Theme color maps for the typewriter housing
  const themeStyles = {
    'vintage-green': {
      body: 'bg-[#2d4739] border-[#1d3126] shadow-[#13221a]',
      accent: 'bg-[#22382c]',
      badge: 'border-[#ca8a04] bg-[#1a2d21] text-amber-300',
      label: 'Vintage Seafoam (1950s Hermes)',
    },
    'matte-black': {
      body: 'bg-[#202022] border-[#141416] shadow-[#0a0a0c]',
      accent: 'bg-[#18181b]',
      badge: 'border-[#e2e8f0] bg-[#121214] text-neutral-200',
      label: 'Matte Obsidian (Smith-Corona)',
    },
    'burgundy': {
      body: 'bg-[#4c1d24] border-[#361318] shadow-[#240b0f]',
      accent: 'bg-[#3b151c]',
      badge: 'border-[#f59e0b] bg-[#2a0e13] text-amber-200',
      label: 'Royal Burgundy (Aristocrat)',
    },
    'teal': {
      body: 'bg-[#1e3a45] border-[#13262e] shadow-[#0b171c]',
      accent: 'bg-[#162d36]',
      badge: 'border-[#38bdf8] bg-[#0f2027] text-sky-200',
      label: 'Retro Petrol Teal (Olivetti)',
    },
    'cream': {
      body: 'bg-[#d8cfbc] border-[#b0a48d] shadow-[#786e58]',
      accent: 'bg-[#c5bba6]',
      badge: 'border-[#78350f] bg-[#ede5d3] text-amber-950',
      label: 'Industrial Ivory (Adler)',
    },
  };

  const currentTheme = themeStyles[theme];

  const handleToggleSound = () => {
    const nextState = !soundMuted;
    setSoundMuted(nextState);
    typewriterAudio.setMuted(nextState);
    if (!nextState) {
      typewriterAudio.playBell();
    }
  };

  const handleCarriageLever = () => {
    setLeverPulled(true);
    typewriterAudio.playCarriageReturn();
    onCarriageReturn();
    setTimeout(() => setLeverPulled(false), 350);
  };

  const handlePrintMemo = () => {
    typewriterAudio.playPaperTear();
    window.print();
  };

  const handlePlatenRotate = (direction: 'up' | 'down') => {
    typewriterAudio.playPaperRoll();
    if (direction === 'up') onPaperScrollUp();
    else onPaperScrollDown();
  };

  const progressPercent =
    tasksCount.total > 0
      ? Math.round((tasksCount.completed / tasksCount.total) * 100)
      : 0;

  return (
    <div className="w-full min-h-screen py-4 px-2 sm:px-6 flex flex-col items-center justify-start relative">
      {/* Top Application Bar with Theme, Sound, Print, and Reset buttons */}
      <header className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-4 px-3 py-2 bg-neutral-900/80 backdrop-blur-md rounded-xl border border-neutral-800 text-neutral-300 text-xs font-courier shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-widest text-amber-200 font-brand text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            TYPEWRITER TO-DO
          </div>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <div className="text-[11px] text-neutral-400 hidden sm:flex items-center gap-1">
            <span>EFFICIENCY:</span>
            <span className="font-bold text-amber-300">{progressPercent}%</span>
            <span>({tasksCount.completed}/{tasksCount.total})</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Theme Picker Dropdown */}
          <div className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded border border-neutral-700/70">
            <Palette className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={theme}
              onChange={(e) => {
                typewriterAudio.playKeyClick();
                setTheme(e.target.value as TypewriterTheme);
              }}
              className="bg-transparent text-[11px] font-courier text-neutral-200 focus:outline-none cursor-pointer"
            >
              <option value="vintage-green" className="bg-neutral-900 text-white">HERMES GREEN</option>
              <option value="matte-black" className="bg-neutral-900 text-white">OBSIDIAN BLACK</option>
              <option value="burgundy" className="bg-neutral-900 text-white">ROYAL BURGUNDY</option>
              <option value="teal" className="bg-neutral-900 text-white">PETROL TEAL</option>
              <option value="cream" className="bg-neutral-900 text-white">INDUSTRIAL CREAM</option>
            </select>
          </div>

          {/* Tag Manager Button */}
          {onOpenTagManager && (
            <button
              id="tag-manager-header-btn"
              onClick={() => {
                typewriterAudio.playKeyClick();
                onOpenTagManager();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border border-amber-800/80 text-xs font-bold font-courier transition-colors cursor-pointer"
              title="Add, Edit, or Rename Tags"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px]">TAGS</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={handleToggleSound}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-courier transition-colors ${
              soundMuted
                ? 'bg-red-950/40 text-red-300 border-red-800'
                : 'bg-neutral-800 text-amber-300 border-neutral-700 hover:bg-neutral-700'
            }`}
            title={soundMuted ? 'Unmute Mechanical Sound' : 'Mute Mechanical Sound'}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{soundMuted ? 'MUTED' : 'AUDIO ON'}</span>
          </button>

          {/* Print / Tear Memo */}
          <button
            id="print-memo-btn"
            onClick={handlePrintMemo}
            className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 text-xs transition-colors"
            title="Print or Save Memo Sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">PRINT</span>
          </button>

          {/* Clear Completed */}
          {tasksCount.completed > 0 && (
            <button
              id="clear-completed-btn"
              onClick={() => {
                typewriterAudio.playPaperTear();
                onClearCompleted();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800 text-[10px] transition-colors"
              title="Clear all completed entries"
            >
              <RotateCcw className="w-3 h-3" />
              <span>CLEAR DONE</span>
            </button>
          )}

          {/* Help button */}
          <button
            id="typewriter-help-btn"
            onClick={() => setShowGuide(!showGuide)}
            className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
            title="Typewriter Guide & Shortcuts"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Guide Dropdown Modal */}
      {showGuide && (
        <div className="w-full max-w-4xl bg-neutral-900 border border-amber-500/40 rounded-lg p-4 mb-4 text-xs font-courier text-neutral-300 shadow-2xl relative">
          <button
            onClick={() => setShowGuide(false)}
            className="absolute top-2 right-2 text-neutral-400 hover:text-white px-1.5 py-0.5"
          >
            ✕
          </button>
          <h3 className="font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> VINTAGE TYPEWRITER OPERATION MANUAL:
          </h3>
          <ul className="space-y-1.5 list-disc list-inside text-neutral-300">
            <li><strong className="text-white">Type & Strike:</strong> Click the on-screen keys or simply type directly on your physical keyboard to clack and strike tasks!</li>
            <li><strong className="text-white">Carriage Return:</strong> Press Enter or pull the chrome lever on the left to strike the task onto the paper and ring the brass bell.</li>
            <li><strong className="text-white">Platen Knobs:</strong> Click the knurled knobs on the left/right of the roller bar to feed paper up/down.</li>
            <li><strong className="text-white">Task Completion:</strong> Click the <code className="bg-neutral-800 px-1 py-0.5 rounded text-amber-200 font-bold">[ ]</code> bracket on any task to stamp it complete with ink overstrike!</li>
            <li><strong className="text-white">Two-Tone Ribbon:</strong> Toggle between Black and Red ink ribbons for high-priority items.</li>
          </ul>
        </div>
      )}

      {/* 
        ================================================================
        THE TYPEWRITER CHASSIS & WINDOW CONTAINER (PHYSICAL SHAPED FRAME)
        ================================================================
      */}
      <div
        id="typewriter-chassis-container"
        className={`w-full max-w-4xl rounded-3xl border-4 ${currentTheme.body} p-3 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] relative transition-all duration-300`}
      >
        {/* Chassis Corner Rivets / Screws */}
        <div className="absolute top-3 left-4 w-2.5 h-2.5 rounded-full bg-neutral-400 border border-neutral-700 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-neutral-800 rotate-45" />
        </div>
        <div className="absolute top-3 right-4 w-2.5 h-2.5 rounded-full bg-neutral-400 border border-neutral-700 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-neutral-800 -rotate-45" />
        </div>
        <div className="absolute bottom-3 left-4 w-2.5 h-2.5 rounded-full bg-neutral-400 border border-neutral-700 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-neutral-800 rotate-12" />
        </div>
        <div className="absolute bottom-3 right-4 w-2.5 h-2.5 rounded-full bg-neutral-400 border border-neutral-700 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-neutral-800 -rotate-30" />
        </div>

        {/* 
          TOP CARRIAGE ASSEMBLY (Roller Platen, Knobs, Return Lever, Paper Bail Ruler)
        */}
        <div className="relative mb-3 pt-2 pb-1">
          {/* Chrome Carriage Return Lever on Top Left */}
          <div className="absolute -top-3 sm:-top-5 left-2 sm:left-4 z-20">
            <motion.button
              id="carriage-return-lever"
              onClick={handleCarriageLever}
              animate={leverPulled ? { rotate: [-15, -45, 0], x: [-5, -15, 0] } : { rotate: -15, x: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="group flex flex-col items-center cursor-pointer select-none"
              title="Pull Carriage Return Lever (Ding!)"
            >
              {/* Chrome Curved Lever Arm */}
              <div className="w-2.5 sm:w-3 h-10 sm:h-14 metallic-chrome rounded-full border border-slate-400 shadow-lg group-hover:brightness-110" />
              <div className="w-5 sm:w-7 h-4 sm:h-5 metallic-chrome rounded-full -mt-1 border border-slate-400 shadow-md flex items-center justify-center text-[8px] font-bold font-courier text-neutral-800">
                PULL
              </div>
            </motion.button>
          </div>

          {/* Left Platen Roller Knob */}
          <button
            id="platen-knob-left"
            onClick={() => handlePlatenRotate('up')}
            className="absolute top-2 -left-2 sm:-left-3 z-10 w-6 sm:w-8 h-10 sm:h-12 bg-neutral-900 border-2 border-neutral-600 rounded-l-md shadow-2xl flex flex-col items-center justify-center hover:bg-neutral-800 active:scale-95 cursor-pointer"
            title="Roll Platen Up (Scroll Paper)"
          >
            <div className="w-full h-1 bg-neutral-700 mb-1" />
            <div className="w-full h-1 bg-neutral-700 mb-1" />
            <div className="w-full h-1 bg-neutral-700" />
          </button>

          {/* Right Platen Roller Knob */}
          <button
            id="platen-knob-right"
            onClick={() => handlePlatenRotate('down')}
            className="absolute top-2 -right-2 sm:-right-3 z-10 w-6 sm:w-8 h-10 sm:h-12 bg-neutral-900 border-2 border-neutral-600 rounded-r-md shadow-2xl flex flex-col items-center justify-center hover:bg-neutral-800 active:scale-95 cursor-pointer"
            title="Roll Platen Down (Scroll Paper)"
          >
            <div className="w-full h-1 bg-neutral-700 mb-1" />
            <div className="w-full h-1 bg-neutral-700 mb-1" />
            <div className="w-full h-1 bg-neutral-700" />
          </button>

          {/* The Black Roller Platen Cylinder */}
          <div className="relative mx-6 sm:mx-8 h-7 sm:h-9 bg-linear-to-b from-neutral-950 via-neutral-900 to-neutral-950 rounded-md border-y border-neutral-700 shadow-inner flex items-center justify-between px-4 overflow-hidden">
            {/* Platen rubber texture bands */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px]" />

            {/* Paper Bail Bar with Engraved Calibration Ruler */}
            <div className="relative z-10 w-full flex items-center justify-between text-[8px] sm:text-[9px] font-courier text-neutral-400 select-none tracking-widest px-2">
              <span>| 0</span>
              <span className="hidden sm:inline">10</span>
              <span>20</span>
              <span className="hidden sm:inline">30</span>
              <span>40</span>
              <span className="hidden sm:inline">50</span>
              <span>60</span>
              <span className="hidden sm:inline">70</span>
              <span>80 |</span>
            </div>
          </div>
        </div>

        {/* 
          CENTRAL PAPER FEED REVEAL AREA (The Paper emerges from the platen roller)
        */}
        <div className="relative z-10">
          {children}
        </div>

        {/* 
          LOWER CARRIAGE / TYPEBAR BASKET & EMBLEM PLATE
        */}
        <div className="mt-3 pt-2 border-t border-neutral-900/60 flex flex-col items-center relative">
          {/* Vintage Brass Branding Emblem Badge */}
          <div
            id="typewriter-badge-plate"
            className={`px-4 sm:px-6 py-1 rounded-full border-2 ${currentTheme.badge} shadow-md flex items-center gap-2 select-none my-1`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-xs" />
            <span className="font-brand font-extrabold tracking-[0.2em] text-xs sm:text-sm uppercase">
              {brandName} • PRECISION MODEL
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-xs" />
          </div>

          {/* Visible Dual Ribbon Spools with winding mechanism */}
          <div className="w-full flex items-center justify-between px-6 sm:px-12 -mt-4 mb-2 pointer-events-none">
            {/* Left Spool */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-neutral-700 bg-neutral-950 shadow-inner flex items-center justify-center">
              <div
                className={`w-5 h-5 rounded-full border border-neutral-600 ${
                  ribbonColor === 'red' ? 'bg-red-900' : 'bg-neutral-800'
                } flex items-center justify-center`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              </div>
            </div>

            {/* Center Typebar Radial Fan Housing */}
            <div className="flex-1 max-w-xs mx-4 h-4 relative flex items-end justify-center">
              <div className="w-full h-3 border-t-2 border-neutral-700 rounded-t-full bg-black/40 flex items-center justify-center">
                {/* Visual Typebar Linkages */}
                <div className="flex items-center gap-1 opacity-60">
                  <div className="w-[1px] h-2 bg-neutral-400 -rotate-30" />
                  <div className="w-[1px] h-2.5 bg-neutral-400 -rotate-15" />
                  <div className="w-[1.5px] h-3 bg-amber-300" />
                  <div className="w-[1px] h-2.5 bg-neutral-400 rotate-15" />
                  <div className="w-[1px] h-2 bg-neutral-400 rotate-30" />
                </div>
              </div>
            </div>

            {/* Right Spool */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-neutral-700 bg-neutral-950 shadow-inner flex items-center justify-center">
              <div
                className={`w-5 h-5 rounded-full border border-neutral-600 ${
                  ribbonColor === 'red' ? 'bg-red-900' : 'bg-neutral-800'
                } flex items-center justify-center`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="mt-4 text-center text-neutral-500 font-courier text-[11px] select-none">
        <p>TYPEWRITER TO-DO • CRAFTED WITH MECHANICAL AUDIO & PHYSICAL ESCAPEMENT</p>
      </footer>
    </div>
  );
};
