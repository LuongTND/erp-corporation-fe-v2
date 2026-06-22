import { AnalyticsStatsRow } from '../components/admin-analytics/AnalyticsStatsRow'
import { CompletionRateChart } from '../components/admin-analytics/CompletionRateChart'
import { ContentEffectivenessTable } from '../components/admin-analytics/ContentEffectivenessTable'
import {
  MOCK_ANALYTICS_STATS,
  MOCK_CONTENT_EFFECTIVENESS,
  MOCK_WEEKLY_COMPLETION,
} from '../mocks/analytics.mock'

export default function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Phân tích Hiệu quả Đào tạo</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Tổng quan chỉ số học tập và hiệu quả nội dung
        </p>
      </div>

      {/* Stats row */}
      <AnalyticsStatsRow stats={MOCK_ANALYTICS_STATS} />

      {/* Completion chart */}
      <CompletionRateChart data={MOCK_WEEKLY_COMPLETION} />

      {/* Content effectiveness table */}
      <ContentEffectivenessTable rows={MOCK_CONTENT_EFFECTIVENESS} />
    </div>
  )
}
