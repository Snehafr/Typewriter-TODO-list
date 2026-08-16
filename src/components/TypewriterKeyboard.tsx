import React, { useState } from 'react';
import { typewriterAudio } from '../audio/typewriterAudio';
import { RibbonColor } from '../types';
import { Bell, CornerDownLeft, Delete, ChevronDown, ChevronUp } from 'lucide-react';

interface TypewriterKeyboardProps {
  onKeyPress: (char: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  onSpace: () => void;
  activeKey: string | null;
  ribbonColor: RibbonColor;
  onToggleRibbon: () => void;
}

export const TypewriterKeyboard: React.FC<TypewriterKeyboardProps> = ({
  onKeyPress,
  onEnter,
  onBackspace,
  onSpace,
  activeKey,
  ribbonColor,
  onToggleRibbon,
}) => {
  const [isShifted, setIsShifted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Keyboard Rows layout
  const row1 = [
    { normal: '1', shift: '!' },
    { normal: '2', shift: '@' },
    { normal: '3', shift: '#' },
    { normal: '4', shift: '$' },
    { normal: '5', shift: '%' },
    { normal: '6', shift: '^' },
    { normal: '7', shift: '&' },
    { normal: '8', shift: '*' },
    { normal: '9', shift: '(' },
    { normal: '0', shift: ')' },
    { normal: '-', shift: '_' },
    { normal: '=', shift: '+' },
  ];

  const row2 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row3 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', ':'];
  const row4 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '?'];

  const handleKeyClick = (char: string) => {
    typewriterAudio.playKeyClick();
    onKeyPress(isShifted ? char.toUpperCase() : char.toLowerCase());
  };

  const handleShiftClick = () => {
    typewriterAudio.playKeyClick(2);
    setIsShifted(!isShifted);
  };

  const handleBellClick = () => {
    typewriterAudio.playBell();
  };

  return (
    <div
      id="vintage-typewriter-keyboard"
      className="w-full max-w-2xl mx-auto bg-linear-to-b from-neutral-900 via-neutral-950 to-black p-3 sm:p-5 rounded-b-xl border-x-2 border-b-2 border-neutral-700/80 shadow-2xl relative"
    >
      {/* Top Header of the keyboard section with collapse toggle and mechanical branding */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-800 text-[11px] font-courier text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          <span className="tracking-widest uppercase font-bold text-neutral-300">
            MECHANICAL ESCAPEMENT KEYSET
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-neutral-500 hidden sm:inline">
            CLICK KEYS OR USE PHYSICAL KEYBOARD
          </span>
          <button
            id="toggle-keyboard-view-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            {isCollapsed ? (
              <>
                <span>SHOW KEYS</span>
                <ChevronDown className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>HIDE KEYS</span>
                <ChevronUp className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-2 sm:space-y-2.5 flex flex-col items-center">
          {/* Row 1: Numbers & Symbols + Backspace */}
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full flex-wrap">
            {row1.map((item) => {
              const displayChar = isShifted ? item.shift : item.normal;
              const isPressed =
                activeKey === item.normal.toUpperCase() || activeKey === item.shift;

              return (
                <button
                  key={item.normal}
                  type="button"
                  onClick={() => handleKeyClick(displayChar)}
                  className={`typewriter-key ${
                    isPressed ? 'is-pressed' : ''
                  } w-8 h-8 sm:w-10 sm:h-10 rounded-full flex flex-col items-center justify-center font-typewriter font-bold text-xs sm:text-sm bg-neutral-900 border-2 border-neutral-400 shadow-[0_3px_5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] text-amber-100 hover:bg-neutral-800 active:scale-95 cursor-pointer`}
                >
                  <span className="text-[9px] sm:text-[10px] text-neutral-400 leading-none">
                    {item.shift}
                  </span>
                  <span className="leading-none">{item.normal}</span>
                </button>
              );
            })}

            {/* Backspace Key */}
            <button
              id="keyboard-backspace-btn"
              type="button"
              onClick={() => {
                typewriterAudio.playBackspace();
                onBackspace();
              }}
              className="typewriter-key px-2 sm:px-3 h-8 sm:h-10 rounded-lg flex items-center justify-center gap-1 font-courier font-bold text-xs bg-neutral-900 border-2 border-neutral-400 shadow-[0_3px_5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] text-amber-200 hover:bg-neutral-800 active:scale-95 cursor-pointer"
              title="Backspace / Erase"
            >
              <Delete className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">BS</span>
            </button>
          </div>

          {/* Row 2: QWERTY */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 w-full flex-wrap">
            {row2.map((letter) => {
              const isPressed = activeKey === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleKeyClick(letter)}
                  className={`typewriter-key ${
                    isPressed ? 'is-pressed' : ''
                  } w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-typewriter font-bold text-xs sm:text-base bg-neutral-900 border-2 border-neutral-300 shadow-[0_3px_5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] text-amber-100 hover:bg-neutral-800 active:scale-95 cursor-pointer`}
                >
                  {isShifted ? letter : letter.toLowerCase()}
                </button>
              );
            })}
          </div>

          {/* Row 3: ASDF */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 w-full flex-wrap">
            {row3.map((char) => {
              const isPressed = activeKey === char;
              return (
                <button
                  key={char}
                  type="button"
                  onClick={() => handleKeyClick(char)}
                  className={`typewriter-key ${
                    isPressed ? 'is-pressed' : ''
                  } w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-typewriter font-bold text-xs sm:text-base bg-neutral-900 border-2 border-neutral-300 shadow-[0_3px_5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] text-amber-100 hover:bg-neutral-800 active:scale-95 cursor-pointer`}
                >
                  {isShifted ? char.toUpperCase() : char.toLowerCase()}
                </button>
              );
            })}
          </div>

          {/* Row 4: Shift, ZXCV, Return */}
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full flex-wrap">
            {/* Shift Key */}
            <button
              id="keyboard-shift-btn"
              type="button"
              onClick={handleShiftClick}
              className={`typewriter-key px-2.5 sm:px-3.5 h-8 sm:h-10 rounded-lg flex items-center justify-center font-courier font-bold text-xs border-2 shadow-[0_3px_5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all cursor-pointer ${
                isShifted
                  ? 'bg-amber-400 text-neutral-950 border-amber-300'
                  : 'bg-neutral-900 text-amber-100 border-neutral-400 hover:bg-neutral-800'
              }`}
            >
              SHIFT
            </button>

            {row4.map((char) => {
              const isPressed = activeKey === char;
              return (
                <button
                  key={char}
                  type="button"
                  onClick={() => handleKeyClick(char)}
                  className={`typewriter-key ${
                    isPressed ? 'is-pressed' : ''
                  } w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-typewriter font-bold text-xs sm:text-base bg-neutral-900 border-2 border-neutral-300 shadow-[0_3px_5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] text-amber-100 hover:bg-neutral-800 active:scale-95 cursor-pointer`}
                >
                  {isShifted ? char.toUpperCase() : char.toLowerCase()}
                </button>
              );
            })}

            {/* Return / Enter Key */}
            <button
              id="keyboard-return-btn"
              type="button"
              onClick={() => {
                typewriterAudio.playCarriageReturn();
                onEnter();
              }}
              className="typewriter-key px-2.5 sm:px-4 h-8 sm:h-10 rounded-lg flex items-center justify-center gap-1 font-courier font-bold text-xs bg-linear-to-b from-amber-700 to-amber-900 border-2 border-amber-400 text-amber-50 shadow-[0_3px_5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <span>RETURN</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Row 5: Spacebar & Specialty Mechanism Controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 w-full pt-1">
            {/* Bell Gong Button */}
            <button
              id="keyboard-bell-btn"
              type="button"
              onClick={handleBellClick}
              className="typewriter-key px-2.5 sm:px-3 h-8 sm:h-9 rounded-full flex items-center justify-center gap-1 font-courier text-xs bg-neutral-900 border-2 border-amber-400/80 text-amber-300 shadow-[0_3px_5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:bg-neutral-800 cursor-pointer"
              title="Ring Brass Bell"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">BELL</span>
            </button>

            {/* Authentic Wide Heavy Spacebar */}
            <button
              id="keyboard-spacebar-btn"
              type="button"
              onClick={() => {
                typewriterAudio.playSpace();
                onSpace();
              }}
              className={`typewriter-key ${
                activeKey === ' ' ? 'is-pressed' : ''
              } flex-1 max-w-xs sm:max-w-sm h-8 sm:h-9 rounded-md bg-linear-to-b from-neutral-800 to-neutral-950 border-2 border-neutral-400 shadow-[0_4px_6px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.3)] text-neutral-400 text-xs font-courier font-bold tracking-[0.3em] flex items-center justify-center hover:bg-neutral-800 active:scale-98 cursor-pointer select-none`}
            >
              — S P A C E —
            </button>

            {/* Ribbon Color Toggle Key */}
            <button
              id="keyboard-ribbon-toggle-btn"
              type="button"
              onClick={() => {
                typewriterAudio.playKeyClick();
                onToggleRibbon();
              }}
              className="typewriter-key px-2.5 sm:px-3 h-8 sm:h-9 rounded-full flex items-center justify-center gap-1.5 font-courier text-xs bg-neutral-900 border-2 border-neutral-400 text-amber-100 shadow-[0_3px_5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:bg-neutral-800 cursor-pointer"
              title="Toggle Ink Ribbon (Black / Red)"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full border border-white/50 ${
                  ribbonColor === 'red' ? 'bg-red-600' : 'bg-neutral-900'
                }`}
              />
              <span className="hidden sm:inline text-[10px]">
                {ribbonColor.toUpperCase()}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
