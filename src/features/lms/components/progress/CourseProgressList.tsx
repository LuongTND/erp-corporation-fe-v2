import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CourseProgress, CourseStatus } from '../../types/progress.types';

const FILTER_OPTIONS: Array<{ label: string; value: CourseStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
];

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="rounded-full bg-[#efe9de] px-2 py-0.5 text-[10px] font-medium text-[#6c6a64]">
      {category}
    </span>
  );
}

function CourseRow({ course }: { course: CourseProgress }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-4 shadow-sm transition-colors hover:bg-[#f5f0e8]">
      {/* Thumbnail */}
      <div
        className="h-[60px] w-20 shrink-0 rounded-lg"
        style={{ backgroundColor: course.thumbnailColor }}
        aria-hidden
      />

      {/* Middle — info */}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-[#141413]">{course.title}</p>
          <CategoryBadge category={course.category} />
        </div>
        <p className="mb-2 text-xs text-[#6c6a64]">
          Module {course.currentModule} of {course.totalModules}
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6dfd8]">
          <div
            className="h-full rounded-full bg-[#cc785c] transition-all duration-500"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
        <p className="mt-1 text-xs font-medium text-[#cc785c]">{course.progressPercent}%</p>
      </div>

      {/* Right — date + action */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="text-xs text-[#8e8b82]">Last accessed {course.lastAccessed}</p>
        {course.status === 'completed' ? (
          <span className="rounded-full bg-[#5db872]/15 px-3 py-1 text-xs font-medium text-[#3d7a45]">
            Completed
          </span>
        ) : (
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-[#cc785c] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#a9583e]"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

interface CourseProgressListProps {
  readonly courses: readonly CourseProgress[];
}

export function CourseProgressList({ courses }: CourseProgressListProps) {
  const [filter, setFilter] = useState<CourseStatus | 'all'>('all');

  const filtered = filter === 'all' ? courses : courses.filter((c) => c.status === filter);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#141413]">Active Courses</h2>

        <div className="flex items-center overflow-hidden rounded-lg border border-[#e6dfd8] bg-[#faf9f5]">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={cn(
                'cursor-pointer px-3 py-1.5 text-xs font-medium transition-colors',
                filter === opt.value
                  ? 'bg-[#cc785c] text-white'
                  : 'text-[#6c6a64] hover:bg-[#f5f0e8]',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((course) => (
          <CourseRow key={course.id} course={course} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-[#8e8b82]">No courses in this category.</p>
        )}
      </div>
    </div>
  );
}
