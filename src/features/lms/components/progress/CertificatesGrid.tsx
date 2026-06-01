import { Award, Download, Lock } from 'lucide-react';
import type { Certificate } from '../../types/progress.types';

function CertCard({ cert }: { cert: Certificate }) {
  if (cert.locked) {
    return (
      <div className="relative flex flex-col items-center rounded-xl border-2 border-[#e6dfd8] bg-[#f5f0e8] p-5 opacity-60">
        <div className="relative mb-3">
          <Award className="h-12 w-12 text-[#8e8b82]" />
          <Lock className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#f5f0e8] text-[#8e8b82]" />
        </div>
        <p className="mb-1 text-center text-sm font-semibold text-[#6c6a64]">{cert.courseName}</p>
        <p className="text-xs text-[#8e8b82]">Complete course to unlock</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center rounded-xl border-2 bg-[#faf9f5] p-5 shadow-sm" style={{ borderColor: 'rgba(93,184,114,0.4)' }}>
      <Award className="mb-3 h-12 w-12 text-[#5db872]" />
      <p className="mb-1 text-center text-sm font-semibold text-[#141413]">{cert.courseName}</p>
      <p className="mb-4 text-xs text-[#8e8b82]">Completed {cert.completedDate}</p>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#5db872] py-1.5 text-xs font-medium text-[#3d7a45] transition-colors hover:bg-[#5db872]/10"
      >
        <Download className="h-3.5 w-3.5" />
        Download PDF
      </button>
    </div>
  );
}

interface CertificatesGridProps {
  readonly certificates: readonly Certificate[];
}

export function CertificatesGrid({ certificates }: CertificatesGridProps) {
  return (
    <div id="certificates">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#141413]">Certificates &amp; Badges</h2>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 py-1.5 text-xs font-medium text-[#6c6a64] transition-colors hover:bg-[#f5f0e8]"
        >
          <Download className="h-3.5 w-3.5" />
          Download All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  );
}
