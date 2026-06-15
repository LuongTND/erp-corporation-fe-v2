import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList, ResponsiveContainer } from 'recharts';
import type { WeeklyActivity } from '../../types/progress.types';

interface WeeklyActivityChartProps {
  readonly data: readonly WeeklyActivity[];
  readonly totalMinutes: number;
}

function formatTotal(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function WeeklyActivityChart({ data, totalMinutes }: WeeklyActivityChartProps) {
  return (
    <div className="rounded-2xl border border-[#e6dfd8] bg-[#faf9f5] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#141413]">This Week</h2>
        <span className="rounded-full bg-[#efe9de] px-3 py-1 text-xs font-semibold text-[#cc785c]">
          {formatTotal(totalMinutes)} total
        </span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={[...data]} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="#e6dfd8" strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8e8b82' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#8e8b82' }}
            tickFormatter={(v) => `${v}m`}
            width={32}
          />
          <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.day}
                fill={entry.isToday ? '#cc785c' : '#efe9de'}
              />
            ))}
            <LabelList
              dataKey="minutes"
              position="top"
              content={({ x, y, width, value, index }) => {
                if (!data[index as number]?.isToday) return null;
                return (
                  <text
                    x={(x as number) + (width as number) / 2}
                    y={(y as number) - 4}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={600}
                    fill="#cc785c"
                  >
                    {value}m
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
