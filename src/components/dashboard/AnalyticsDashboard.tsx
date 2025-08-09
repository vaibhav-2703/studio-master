
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart as BarChartIcon, Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Link, MousePointerClick, Globe } from "lucide-react"
import { AnalyticsData } from "@/lib/types";
import { AnimatedCounter } from "../shared/AnimatedCounter";


const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "hsl(var(--primary))",
  },
  country: {
    label: "Country",
    color: "hsl(var(--primary))",
  },
}

interface AnalyticsDashboardProps {
    analyticsData: AnalyticsData;
}

export function AnalyticsDashboard({ analyticsData }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <AnimatedCounter to={analyticsData.totalClicks} />
                <p className="text-xs text-muted-foreground">
                    All‑time clicks
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                <Link className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <AnimatedCounter to={analyticsData.totalLinks} />
                <p className="text-xs text-muted-foreground">Links created</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Country</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{analyticsData.topCountry}</div>
                <p className="text-xs text-muted-foreground">
                    {analyticsData.clicksByCountry.length > 0 ? 'Most clicks from' : 'No data yet'}
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Click-Through</CardTitle>
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <div className="text-2xl font-bold">{new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(analyticsData.averageCtr)}%</div>
                <p className="text-xs text-muted-foreground">
                    {analyticsData.averageCtr > 0 ? 'Based on tracked clicks' : 'No data yet'}
                </p>
            </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
            <CardTitle>Click Performance</CardTitle>
            <CardDescription>A summary of your link clicks over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={analyticsData.clicksByDate}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
                          <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--primary) / 0.06)' }} />
                          <Line type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>

        {analyticsData.clicksByCountry.length > 0 && (
            <Card>
                <CardHeader>
                <CardTitle>Clicks by Country</CardTitle>
                <CardDescription>Geographic distribution of your link clicks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.clicksByCountry}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="country" stroke="hsl(var(--muted-foreground))" />
                              <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(n) => new Intl.NumberFormat().format(Number(n))} />
                              <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--primary) / 0.06)' }} />
                              <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        )}
    </div>
  )
}
