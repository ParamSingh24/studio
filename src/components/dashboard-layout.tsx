
"use client"

import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar"
import { HardDrive, Home, Copy, Settings, PieChart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/duplicates", label: "Duplicates", icon: Copy },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="size-6 text-primary" />
              <span className="text-lg font-semibold">CleanSweep AI</span>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton isActive={pathname === item.href} asChild>
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
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
