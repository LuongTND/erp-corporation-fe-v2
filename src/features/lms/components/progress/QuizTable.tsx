import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { QuizResult, QuizStatus } from '../../types/progress.types';

function ScoreBadge({ score }: { score: number }) {
  const style =
    score >= 80
      ? { bg: 'rgba(93,184,114,0.15)', color: '#3d7a45' }
      : score >= 60
      ? { bg: 'rgba(232,165,90,0.15)', color: '#9a6028' }
      : { bg: 'rgba(198,69,69,0.15)', color: '#c64545' };

  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {score}%
    </span>
  );
}

const STATUS_STYLES: Record<QuizStatus, { bg: string; color: string; label: string }> = {
  passed: { bg: 'rgba(93,184,114,0.15)', color: '#3d7a45', label: 'Passed' },
  failed: { bg: 'rgba(198,69,69,0.15)', color: '#c64545', label: 'Failed' },
  retake: { bg: 'rgba(232,165,90,0.15)', color: '#9a6028', label: 'Retake Available' },
};

function StatusPill({ status }: { status: QuizStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

interface QuizTableProps {
  readonly results: readonly QuizResult[];
}

export function QuizTable({ results }: QuizTableProps) {
  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-[#141413]">Quiz Performance</h2>

      <div className="overflow-hidden rounded-2xl border border-[#e6dfd8] bg-[#faf9f5] shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-[#e6dfd8] hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-[#6c6a64]">Course</TableHead>
              <TableHead className="text-xs font-semibold text-[#6c6a64]">Quiz Name</TableHead>
              <TableHead className="text-xs font-semibold text-[#6c6a64]">Score</TableHead>
              <TableHead className="text-xs font-semibold text-[#6c6a64]">Status</TableHead>
              <TableHead className="text-xs font-semibold text-[#6c6a64]">Date</TableHead>
              <TableHead className="text-xs font-semibold text-[#6c6a64]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.id} className="border-[#e6dfd8] hover:bg-[#f5f0e8]">
                <TableCell className="text-xs font-medium text-[#3d3d3a]">{row.courseName}</TableCell>
                <TableCell className="text-xs text-[#3d3d3a]">{row.quizName}</TableCell>
                <TableCell><ScoreBadge score={row.score} /></TableCell>
                <TableCell><StatusPill status={row.status} /></TableCell>
                <TableCell className="text-xs text-[#8e8b82]">{row.date}</TableCell>
                <TableCell>
                  <a
                    href="#"
                    className="cursor-pointer text-xs font-medium text-[#cc785c] hover:text-[#a9583e] hover:underline transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    Review
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
