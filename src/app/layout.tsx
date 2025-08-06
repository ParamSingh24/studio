import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import DashboardLayout from '@/components/dashboard-layout';

export const metadata: Metadata = {
  title: 'CleanSweep AI',
  description: 'Intelligent application deduplication and management system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/sf-pro-display@4.5.4/index.css" />
      </head>
      <body className="font-body antialiased">
        <DashboardLayout>{children}</DashboardLayout>
        <Toaster />
      </body>
    </html>
  );
}
