import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CandidateStageBadge } from '../CandidatesPage/CandidateStageBadge'
import { SOURCE_CHANNEL_LABELS } from '../../types/recruitment.types'
import type { CandidateDetail } from '../../types/recruitment.types'

interface CandidateInfoCardProps {
  candidate: CandidateDetail
  canUploadCv: boolean
  onUploadCv: () => void
}

export function CandidateInfoCard({ candidate, canUploadCv, onUploadCv }: CandidateInfoCardProps) {
  return (
    <Card className="shrink-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{candidate.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Phiếu: {candidate.requestCode}</p>
          </div>
          <CandidateStageBadge stage={candidate.stage} />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">SĐT</p>
          <p className="font-medium">{candidate.phone ?? '—'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium">{candidate.email ?? '—'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Nguồn</p>
          <p className="font-medium">
            {candidate.sourceChannel ? SOURCE_CHANNEL_LABELS[candidate.sourceChannel] : '—'}
          </p>
        </div>
        {candidate.evaluationScore != null && (
          <div>
            <p className="text-muted-foreground">Điểm đánh giá</p>
            <p className="font-medium">{candidate.evaluationScore}/10</p>
          </div>
        )}
        {candidate.evaluationRecommendation && (
          <div className="col-span-2">
            <p className="text-muted-foreground">Khuyến nghị</p>
            <p className="font-medium">{candidate.evaluationRecommendation}</p>
          </div>
        )}
        <div className="col-span-2 md:col-span-3 flex items-center gap-3">
          {candidate.cvUrl ? (
            <a
              href={candidate.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Xem CV
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">Chưa có CV</span>
          )}
          {canUploadCv && (
            <Button variant="outline" size="sm" className="cursor-pointer" onClick={onUploadCv}>
              Tải lên CV
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
