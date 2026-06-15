import { Flag, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { QuizQuestion } from '../../types/quiz.types';

type NavStatus = 'answered' | 'current' | 'flagged' | 'unanswered';

function getNavStatus(
  question: QuizQuestion,
  currentId: string,
  answers: Record<string, string>,
  flagged: Set<string>,
): NavStatus {
  if (question.id === currentId) return 'current';
  if (flagged.has(question.id)) return 'flagged';
  if (answers[question.id]) return 'answered';
  return 'unanswered';
}

interface QuizNavigatorPanelProps {
  readonly questions: readonly QuizQuestion[];
  readonly currentQuestionId: string;
  readonly answers: Record<string, string>;
  readonly flagged: Set<string>;
  readonly onNavigate: (index: number) => void;
  readonly onToggleFlag: () => void;
  readonly onSubmit: () => void;
}

export function QuizNavigatorPanel({
  questions,
  currentQuestionId,
  answers,
  flagged,
  onNavigate,
  onToggleFlag,
  onSubmit,
}: QuizNavigatorPanelProps) {
  const currentFlagged = flagged.has(currentQuestionId);
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="fixed left-6 top-[88px] z-30 w-[268px] rounded-2xl border border-[#e6dfd8] bg-[#faf9f5] p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6c6a64]">
        Question Navigator
      </p>

      {/* Grid */}
      <div className="mb-4 grid grid-cols-4 gap-1.5">
        {questions.map((q, i) => {
          const status = getNavStatus(q, currentQuestionId, answers, flagged);

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onNavigate(i)}
              className={cn(
                'relative flex h-9 w-full cursor-pointer items-center justify-center rounded-lg text-xs font-semibold transition-all',
                status === 'answered' && 'bg-[#cc785c] text-white',
                status === 'current' && 'bg-[#faf9f5] text-[#cc785c] ring-2 ring-[#cc785c]',
                status === 'flagged' && 'bg-[#fdf0d5] text-[#d4a017]',
                status === 'unanswered' && 'bg-[#efe9de] text-[#6c6a64]',
              )}
              aria-label={`Go to question ${q.number}`}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              {q.number}
              {status === 'flagged' && (
                <Flag className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 fill-[#d4a017] text-[#d4a017]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mb-4 space-y-1">
        {[
          { color: 'bg-[#cc785c]', label: `Answered (${answeredCount})` },
          { color: 'bg-[#fdf0d5] ring-1 ring-[#e8a55a]', label: `Flagged (${flagged.size})` },
          { color: 'bg-[#efe9de]', label: `Unanswered (${unansweredCount})` },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={cn('h-2.5 w-2.5 rounded-sm', color)} />
            <span className="text-[10px] text-[#8e8b82]">{label}</span>
          </div>
        ))}
      </div>

      {/* Flag toggle */}
      <button
        type="button"
        onClick={onToggleFlag}
        className={cn(
          'mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
          currentFlagged
            ? 'border-[#e8a55a] bg-[#fdf0d5] text-[#d4a017] hover:bg-[#fce8c0]'
            : 'border-[#e6dfd8] bg-[#faf9f5] text-[#6c6a64] hover:bg-[#f5f0e8]',
        )}
      >
        <Flag className={cn('h-3.5 w-3.5', currentFlagged && 'fill-[#d4a017]')} />
        {currentFlagged ? 'Unflag Question' : 'Flag for Review'}
      </button>

      {/* Submit */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#c64545] px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#a83838]"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Submit Quiz
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent className="border-[#e6dfd8] bg-[#faf9f5]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#141413]">Submit quiz?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#6c6a64]">
              You have answered {answeredCount} of {questions.length} questions.
              {unansweredCount > 0 && (
                <span className="block mt-1 font-medium text-[#c64545]">
                  {unansweredCount} question{unansweredCount !== 1 ? 's' : ''} unanswered.
                </span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a] hover:bg-[#f5f0e8]">
              Continue Reviewing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onSubmit}
              className="bg-[#c64545] text-white hover:bg-[#a83838]"
            >
              Submit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
