
"use client"

import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar"
import { HardDrive, Home, Copy, Settings, BarChart, Upload, Tags, Trash2, Database } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const menuItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/upload", label: "Upload & Scan", icon: Upload },
    { href: "/duplicates", label: "Duplicates", icon: Copy },
    { href: "/categories", label: "Categories", icon: Tags },
    { href: "/analytics", label: "Analytics", icon: BarChart },
    { href: "/cleanup", label: "Cleanup", icon: Trash2 },
    { href: "/storage", label: "Storage", icon: Database },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="size-6 text-primary" />
              <span className="text-lg font-semibold">CleanSpace AI</span>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={pathname === item.href}>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <SidebarTrigger/>
            <div className="flex-1">
                 <div className="flex items-center gap-2">
                    <HardDrive className="size-6 text-primary" />
                    <span className="text-lg font-semibold">CleanSweep AI</span>
                </div>
            </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
