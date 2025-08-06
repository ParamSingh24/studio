'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Copy, HardDrive, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {

  return (
    <div className="space-y-6 py-6">
        <div>
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-muted-foreground">
                Here's a quick overview of your system's health.
            </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Duplicates</CardTitle>
                    <Copy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1.2 GB</div>
                    <p className="text-xs text-muted-foreground">in 243 files</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Space Reclaimed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">5.8 GB</div>
                    <p className="text-xs text-muted-foreground">since last week</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Disk Health</CardTitle>
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Good</div>
                    <p className="text-xs text-muted-foreground">75% free space remaining</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Items Requiring Attention</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Large duplicate groups found</p>
                </CardContent>
            </Card>
        </div>

        <Card className="flex flex-col items-center justify-center text-center p-10 md:p-20 border-2 border-dashed border-primary/20 rounded-lg bg-card shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Clean Up?</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                Start a new scan to find and remove duplicate files, reclaiming valuable disk space.
            </p>
            <Link href="/duplicates" passHref>
                <Button size="lg">
                    Go to Duplicates Finder
                </Button>
            </Link>
        </Card>
    </div>
  );
}
