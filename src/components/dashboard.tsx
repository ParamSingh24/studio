'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Copy, HardDrive, AlertTriangle, CheckCircle, TrendingUp, FolderGit2, Percent } from 'lucide-react';
import Link from 'next/link';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const storageSavingsData = [
  { month: 'Jan', saved: 2.1 },
  { month: 'Feb', saved: 3.5 },
  { month: 'Mar', saved: 4.2 },
  { month: 'Apr', saved: 5.8 },
  { month: 'May', saved: 6.5 },
  { month: 'Jun', saved: 8.1 },
];

const categoryBreakdownData = [
  { name: 'Media', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Games', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Productivity', value: 300, fill: 'hsl(var(--chart-3))' },
  { name: 'Development', value: 200, fill: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 278, fill: 'hsl(var(--chart-5))' },
];

const chartConfig = {
  saved: {
    label: "GB Saved",
    color: "hsl(var(--primary))",
  },
  Media: { label: "Media", color: "hsl(var(--chart-1))" },
  Games: { label: "Games", color: "hsl(var(--chart-2))" },
  Productivity: { label: "Productivity", color: "hsl(var(--chart-3))" },
  Development: { label: "Development", color: "hsl(var(--chart-4))" },
  Other: { label: "Other", color: "hsl(var(--chart-5))" },
}

export default function Dashboard() {

  return (
    <div className="space-y-6 py-6">
        <div>
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-muted-foreground">
                Here's a quick overview of your system's health and savings.
            </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Duplicates Found</CardTitle>
                    <Copy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1.2 GB</div>
                    <p className="text-xs text-muted-foreground">in 243 files</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Space Reclaimed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">29.7 GB</div>
                    <p className="text-xs text-muted-foreground">+8.1 GB this month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Disk Health</CardTitle>
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-success-foreground">Good</div>
                    <p className="text-xs text-muted-foreground">75% free space remaining</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Items Requiring Attention</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-warning-foreground">3</div>
                    <p className="text-xs text-muted-foreground">Large duplicate groups found</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Storage Savings Over Time</CardTitle>
                    <CardDescription>Total disk space reclaimed in the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <AreaChart data={storageSavingsData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-saved)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-saved)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                            <YAxis unit="GB" tickLine={false} axisLine={false} tickMargin={10} />
                            <Tooltip
                                cursor={false} 
                                content={<ChartTooltipContent indicator="dot" />} 
                            />
                            <Area type="monotone" dataKey="saved" stroke="var(--color-saved)" fillOpacity={1} fill="url(#colorSaved)" />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Duplicate Categories</CardTitle>
                    <CardDescription>Breakdown of duplicates by category.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-[250px]"
                        >
                        <PieChart>
                            <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={categoryBreakdownData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                {categoryBreakdownData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                             <ChartLegend
                                content={<ChartLegendContent nameKey="name" />}
                                className="-mt-4"
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>

        <Card className="flex flex-col items-center justify-center text-center p-10 md:p-20 border-2 border-dashed border-primary/20 rounded-lg bg-card/50 backdrop-blur-lg shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Clean Up?</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                Start a new scan to find and remove duplicate files, reclaiming valuable disk space.
            </p>
            <Link href="/duplicates" passHref>
                <Button size="lg" className="neumorphic-btn">
                    Go to Duplicates Finder
                </Button>
            </Link>
        </Card>
    </div>
  );
}
