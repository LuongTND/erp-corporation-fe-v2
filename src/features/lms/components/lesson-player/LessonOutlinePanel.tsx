import { useState } from 'react';
import { ArrowLeft, CheckCircle, Lock, PlayCircle, FileText, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { LessonChapter, LessonItem, LessonStatus, LessonType } from '../../types/lesson-player.types';

const lessonTypeIcon = (type: LessonType) => {
  if (type === 'video') return PlayCircle;
  if (type === 'quiz') return HelpCircle;
  return FileText;
};

function LessonStatusIndicator({ status }: { status: LessonStatus }) {
  if (status === 'completed') return <CheckCircle className="h-4 w-4 shrink-0 text-[#5db872]" />;
  if (status === 'locked') return <Lock className="h-3.5 w-3.5 shrink-0 text-[#a09d96]" />;
  if (status === 'current') return <span className="h-2 w-2 shrink-0 rounded-full bg-[#cc785c]" />;
  return null;
}

interface LessonRowProps {
  readonly courseId: string;
  readonly lesson: LessonItem;
  readonly currentLessonId: string;
}

function LessonRow({ courseId, lesson, currentLessonId }: LessonRowProps) {
  const navigate = useNavigate();
  const isCurrent = lesson.id === currentLessonId;
  const Icon = lessonTypeIcon(lesson.type);

  function handleOpenLesson() {
    if (lesson.status === 'locked') return;

    if (lesson.type === 'quiz') {
      navigate(`/lms/course/${courseId}/quiz/${lesson.id}`);
      return;
    }

    navigate(`/lms/course/${courseId}/lesson/${lesson.id}`);
  }

  return (
    <button
      type="button"
      disabled={lesson.status === 'locked'}
      onClick={handleOpenLesson}
      className={cn(
        'flex w-full cursor-pointer items-start gap-2.5 border-l-2 px-3 py-2 text-left transition-colors',
        isCurrent
          ? 'border-[#cc785c] bg-[#f5f0e8] text-[#cc785c]'
          : 'border-transparent hover:bg-[#f5f0e8]',
        lesson.status === 'locked' && 'cursor-not-allowed opacity-60',
      )}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', isCurrent ? 'text-[#cc785c]' : 'text-[#8e8b82]')} />
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-xs font-medium leading-snug', isCurrent ? 'text-[#cc785c]' : 'text-[#3d3d3a]')}>
          {lesson.title}
        </p>
        <p className="mt-0.5 text-[10px] text-[#8e8b82]">{lesson.duration}</p>
      </div>
      <LessonStatusIndicator status={lesson.status} />
    </button>
  );
}

interface ChapterAccordionProps {
  readonly courseId: string;
  readonly chapter: LessonChapter;
  readonly currentLessonId: string;
}

function ChapterAccordion({ courseId, chapter, currentLessonId }: ChapterAccordionProps) {
  const hasCurrentLesson = chapter.lessons.some((l) => l.id === currentLessonId);
  const [open, setOpen] = useState(hasCurrentLesson || chapter.number <= 2);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 hover:bg-[#f5f0e8]"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8e8b82]">
          {chapter.number.toString().padStart(2, '0')}
        </span>
        <span className="min-w-0 flex-1 truncate text-left text-xs font-semibold uppercase tracking-wide text-[#6c6a64]">
          {chapter.title}
        </span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#8e8b82]" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#8e8b82]" />
        )}
      </button>

      {open && (
        <div className="pb-1">
          {chapter.lessons.map((lesson) => (
            <LessonRow key={lesson.id} courseId={courseId} lesson={lesson} currentLessonId={currentLessonId} />
          ))}
        </div>
      )}
    </div>
  );
}

interface LessonOutlinePanelProps {
  readonly courseId: string;
  readonly courseTitle: string;
  readonly chapters: readonly LessonChapter[];
  readonly currentLessonId: string;
}

export function LessonOutlinePanel({ courseId, courseTitle, chapters, currentLessonId }: LessonOutlinePanelProps) {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col border-r border-[#e6dfd8] bg-[#faf9f5]">
      {/* Header */}
      <div className="shrink-0 border-b border-[#e6dfd8] px-3 py-3">
        <button
          type="button"
          onClick={() => navigate(`/lms/course/${courseId}`)}
          className="mb-2 flex cursor-pointer items-center gap-1.5 text-xs text-[#6c6a64] hover:text-[#141413] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Course
        </button>
        <p className="truncate text-sm font-semibold text-[#3d3d3a]">{courseTitle}</p>
      </div>

      {/* Chapter list */}
      <div className="flex-1 overflow-y-auto">
        {chapters.map((chapter) => (
          <ChapterAccordion key={chapter.id} courseId={courseId} chapter={chapter} currentLessonId={currentLessonId} />
        ))}
      </div>
    </div>
  );
}
