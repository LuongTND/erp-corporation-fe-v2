import { ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { QuizQuestion, AnswerOption } from '../../types/quiz.types';

/* ── Option states ── */
type OptionState = 'unselected' | 'selected' | 'correct' | 'wrong';

function getOptionState(
  option: AnswerOption,
  selectedId: string | undefined,
  submitted: boolean,
  correctOptionId: string | undefined,
): OptionState {
  if (!submitted) {
    return selectedId === option.id ? 'selected' : 'unselected';
  }
  if (option.id === correctOptionId) return 'correct';
  if (selectedId === option.id && option.id !== correctOptionId) return 'wrong';
  return 'unselected';
}

function OptionCard({
  option,
  state,
  onClick,
}: {
  option: AnswerOption;
  state: OptionState;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === 'correct' || state === 'wrong'}
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-150',
        state === 'unselected' && 'border-[#e6dfd8] bg-[#faf9f5] hover:bg-[#f5f0e8]',
        state === 'selected' && 'border-[#cc785c] bg-[#f5f0e8]',
        state === 'correct' && 'border-[#5db872] bg-[#f0faf2] cursor-default',
        state === 'wrong' && 'border-[#c64545] bg-[#fdf2f2] cursor-default',
      )}
    >
      {/* Letter circle */}
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
          state === 'unselected' && 'bg-[#efe9de] text-[#3d3d3a]',
          state === 'selected' && 'bg-[#cc785c] text-white',
          state === 'correct' && 'bg-[#5db872] text-white',
          state === 'wrong' && 'bg-[#c64545] text-white',
        )}
      >
        {option.letter}
      </span>

      {/* Text */}
      <span
        className={cn(
          'flex-1 text-sm leading-relaxed',
          state === 'unselected' && 'text-[#3d3d3a]',
          state === 'selected' && 'font-medium text-[#cc785c]',
          state === 'correct' && 'font-medium text-[#3d7a45]',
          state === 'wrong' && 'font-medium text-[#c64545]',
        )}
      >
        {option.text}
      </span>

      {/* Post-submit icon */}
      {state === 'correct' && <CheckCircle className="h-5 w-5 shrink-0 text-[#5db872]" />}
      {state === 'wrong' && <XCircle className="h-5 w-5 shrink-0 text-[#c64545]" />}
    </button>
  );
}

/* ── Question types ── */
function MultipleChoiceOptions({
  question,
  selectedId,
  submitted,
  onSelect,
}: {
  question: QuizQuestion;
  selectedId: string | undefined;
  submitted: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2.5">
      {question.options!.map((opt) => (
        <OptionCard
          key={opt.id}
          option={opt}
          state={getOptionState(opt, selectedId, submitted, question.correctOptionId)}
          onClick={() => !submitted && onSelect(opt.id)}
        />
      ))}
    </div>
  );
}

function TrueFalseOptions({
  question,
  selectedId,
  submitted,
  onSelect,
}: {
  question: QuizQuestion;
  selectedId: string | undefined;
  submitted: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {question.options!.map((opt) => (
        <OptionCard
          key={opt.id}
          option={opt}
          state={getOptionState(opt, selectedId, submitted, question.correctOptionId)}
          onClick={() => !submitted && onSelect(opt.id)}
        />
      ))}
    </div>
  );
}

function TextInputAnswer({
  value,
  onChange,
  submitted,
}: {
  value: string;
  onChange: (v: string) => void;
  submitted: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[#6c6a64]">Your answer</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={submitted}
        rows={4}
        placeholder="Type your answer here..."
        className="resize-none rounded-xl border-[#e6dfd8] bg-[#faf9f5] text-sm text-[#3d3d3a] placeholder:text-[#8e8b82] focus:border-[#cc785c] focus-visible:ring-[#cc785c]/20"
      />
    </div>
  );
}

/* ── Main card ── */
interface QuizQuestionCardProps {
  readonly question: QuizQuestion;
  readonly questionNumber: number;
  readonly selectedOptionId: string | undefined;
  readonly textAnswer: string;
  readonly submitted: boolean;
  readonly onSelectOption: (optionId: string) => void;
  readonly onTextChange: (text: string) => void;
}

export function QuizQuestionCard({
  question,
  questionNumber,
  selectedOptionId,
  textAnswer,
  submitted,
  onSelectOption,
  onTextChange,
}: QuizQuestionCardProps) {
  const typeLabel = {
    'multiple-choice': 'Multiple Choice',
    'true-false': 'True / False',
    'text-input': 'Short Answer',
  }[question.type];

  return (
    <div className="rounded-2xl border border-[#e6dfd8] bg-[#faf9f5] p-8 shadow-sm">
      {/* Header row */}
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#cc785c] text-sm font-bold text-white">
          Q{questionNumber}
        </span>
        <span className="rounded-full bg-[#efe9de] px-2.5 py-0.5 text-xs font-medium text-[#6c6a64]">
          {question.points} pt{question.points !== 1 ? 's' : ''}
        </span>
        <span className="text-xs text-[#8e8b82]">{typeLabel}</span>
      </div>

      {/* Question text */}
      <p className="mb-6 text-xl font-medium leading-relaxed text-[#141413]">
        {question.text}
      </p>

      {/* Optional image placeholder */}
      {question.hasImage && (
        <div className="mb-6 flex h-40 items-center justify-center rounded-xl bg-[#efe9de]">
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-[#8e8b82]" />
            <span className="text-xs text-[#8e8b82]">Email Header Exhibit</span>
          </div>
        </div>
      )}

      {/* Answer area */}
      {question.type === 'multiple-choice' && (
        <MultipleChoiceOptions
          question={question}
          selectedId={selectedOptionId}
          submitted={submitted}
          onSelect={onSelectOption}
        />
      )}
      {question.type === 'true-false' && (
        <TrueFalseOptions
          question={question}
          selectedId={selectedOptionId}
          submitted={submitted}
          onSelect={onSelectOption}
        />
      )}
      {question.type === 'text-input' && (
        <TextInputAnswer
          value={textAnswer}
          onChange={onTextChange}
          submitted={submitted}
        />
      )}
    </div>
  );
}
