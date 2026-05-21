import { useEffect, useState } from 'react';
import { Clock, LogOut } from 'lucide-react';

interface QuizTopBarProps {
  readonly courseName: string;
  readonly quizTitle: string;
  readonly currentQuestion: number;
  readonly totalQuestions: number;
  readonly initialSeconds: number;
  readonly onSaveExit: () => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export function QuizTopBar({
  courseName,
  quizTitle,
  currentQuestion,
  totalQuestions,
  initialSeconds,
  onSaveExit,
}: QuizTopBarProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const isUrgent = seconds < 120;

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const progressPct = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#e6dfd8] bg-[#faf9f5] px-6 shadow-sm">
      {/* Left: course + quiz title */}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#6c6a64]">{courseName}</p>
        <p className="truncate text-sm font-semibold text-[#141413]">{quizTitle}</p>
      </div>

      {/* Center: timer */}
      <div
        className="flex items-center gap-2 rounded-full px-4 py-1.5"
        style={{ backgroundColor: isUrgent ? '#fdf2f2' : '#fdf6ee' }}
      >
        <Clock
          className="h-4 w-4"
          style={{ color: isUrgent ? '#c64545' : '#e8a55a' }}
        />
        <span
          className="font-mono text-lg font-semibold tabular-nums"
          style={{ color: isUrgent ? '#c64545' : '#e8a55a' }}
        >
          {formatTime(seconds)}
        </span>
      </div>

      {/* Right: progress + save exit */}
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6c6a64]">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#e6dfd8]">
            <div
              className="h-full rounded-full bg-[#cc785c] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onSaveExit}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e6dfd8] px-3 py-1.5 text-xs font-medium text-[#6c6a64] transition-colors hover:bg-[#f5f0e8] hover:text-[#3d3d3a]"
        >
          <LogOut className="h-3.5 w-3.5" />
          Save &amp; Exit
        </button>
      </div>
    </div>
  );
}
