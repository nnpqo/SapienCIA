import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Home, Book, Award, LogOut, BookOpenCheck } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Link href="/student/dashboard" className="flex items-center gap-2">
                <BookOpenCheck className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-headline font-semibold">CampusConnect</h2>
            </Link>
            <SidebarTrigger className="ml-auto" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/student/dashboard"><Home />Dashboard</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/student/dashboard"><Book />My Courses</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#"><Award />Rewards</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="mt-auto">
          <SidebarMenu>
             <SidebarMenuItem>
                <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://placehold.co/40x40.png?text=S" alt="Student Avatar" />
                        <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate">Student Name</span>
                        <span className="text-xs text-muted-foreground truncate">student@example.com</span>
                    </div>
                </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/"><LogOut />Logout</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="bg-background min-h-screen">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
