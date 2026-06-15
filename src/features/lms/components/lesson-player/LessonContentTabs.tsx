import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { TranscriptLine, ResourceFile } from '../../types/lesson-player.types';

/* ── Transcript ── */
function TranscriptTab({
  lines,
  currentTimeSeconds,
  onSeek,
}: {
  lines: readonly TranscriptLine[];
  currentTimeSeconds: number;
  onSeek: (s: number) => void;
}) {
  return (
    <div className="space-y-0.5">
      {lines.map((line) => {
        const isCurrent = currentTimeSeconds >= line.timestampSeconds &&
          (lines[lines.indexOf(line) + 1]
            ? currentTimeSeconds < lines[lines.indexOf(line) + 1].timestampSeconds
            : true);

        return (
          <button
            key={line.id}
            type="button"
            onClick={() => onSeek(line.timestampSeconds)}
            className={cn(
              'flex w-full cursor-pointer gap-3 rounded-lg px-3 py-2 text-left transition-colors',
              isCurrent ? 'bg-[#f5f0e8]' : 'hover:bg-[#f5f0e8]',
            )}
          >
            <span className="mt-0.5 shrink-0 text-[10px] tabular-nums text-[#8e8b82]">{line.timestamp}</span>
            <p className={cn('text-xs leading-relaxed', isCurrent ? 'font-medium text-[#a9583e]' : 'text-[#3d3d3a]')}>
              {line.text}
            </p>
          </button>
        );
      })}
    </div>
  );
}

/* ── Resources ── */
function ResourcesTab({ files }: { files: readonly ResourceFile[] }) {
  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.id} className="flex items-center gap-3 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-3">
          <FileText className="h-8 w-8 shrink-0 text-[#8e8b82]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[#3d3d3a]">{file.name}</p>
            <p className="text-[10px] text-[#8e8b82]">{file.size}</p>
          </div>
          <a
            href={file.url}
            download
            aria-label={`Download ${file.name}`}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#e6dfd8] text-[#6c6a64] transition-colors hover:border-[#cc785c] hover:text-[#cc785c]"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      ))}
    </div>
  );
}

/* ── Notes ── */
function NotesTab() {
  const [draft, setDraft] = useState('');
  const [notes, setNotes] = useState<Array<{ id: string; text: string; time: string }>>([]);

  const saveNote = () => {
    if (!draft.trim()) return;
    setNotes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: draft.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setDraft('');
  };

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Write a note for this lesson..."
        rows={4}
        className="w-full resize-none rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-3 text-xs text-[#3d3d3a] outline-none placeholder:text-[#8e8b82] focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]/20"
      />
      <button
        type="button"
        onClick={saveNote}
        disabled={!draft.trim()}
        className="self-end rounded-lg bg-[#cc785c] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#a9583e] disabled:opacity-40"
      >
        Save note
      </button>

      {notes.length > 0 && (
        <div className="mt-1 space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="rounded-lg bg-[#f5f0e8] p-3">
              <p className="text-xs text-[#3d3d3a]">{note.text}</p>
              <p className="mt-1 text-[10px] text-[#8e8b82]">{note.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */
interface LessonContentTabsProps {
  readonly transcript: readonly TranscriptLine[];
  readonly resources: readonly ResourceFile[];
  readonly currentTimeSeconds: number;
  readonly onSeek: (s: number) => void;
}

export function LessonContentTabs({ transcript, resources, currentTimeSeconds, onSeek }: LessonContentTabsProps) {
  return (
    <Tabs defaultValue="transcript" className="flex-col">
      <TabsList variant="line" className="mb-4 h-auto w-fit gap-0 rounded-none border-b border-[#e6dfd8] bg-transparent p-0">
        {(['transcript', 'resources', 'notes'] as const).map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="h-8 rounded-none border-b-2 border-transparent px-4 text-xs font-medium capitalize text-[#6c6a64] data-[state=active]:border-[#cc785c] data-[state=active]:text-[#cc785c]"
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="transcript">
        <TranscriptTab lines={transcript} currentTimeSeconds={currentTimeSeconds} onSeek={onSeek} />
      </TabsContent>
      <TabsContent value="resources">
        <ResourcesTab files={resources} />
      </TabsContent>
      <TabsContent value="notes">
        <NotesTab />
      </TabsContent>
    </Tabs>
  );
}
