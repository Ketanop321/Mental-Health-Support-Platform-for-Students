"use client"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Sample data - in a real app, this would come from your database
const data = [
  { date: "Mon", mood: 3, stress: 4 },
  { date: "Tue", mood: 4, stress: 3 },
  { date: "Wed", mood: 2, stress: 5 },
  { date: "Thu", mood: 3, stress: 4 },
  { date: "Fri", mood: 4, stress: 3 },
  { date: "Sat", mood: 5, stress: 2 },
  { date: "Sun", mood: 4, stress: 2 },
]

export default function MoodChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Mood</span>
                        <span className="font-bold text-primary">{payload[0].value}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Stress</span>
                        <span className="font-bold text-destructive">{payload[1].value}</span>
                      </div>
                    </div>
                  </ChartTooltipContent>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="stress"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
