import { Archive, Database, Inbox, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Peminjaman",
        url: "/peminjaman",
        icon: Database,
    },
    {
        title: "Barang",
        url: "/barang",
        icon: Inbox,
    },
    {
        title: "Rekap Pinjaman",
        url: "/rekap",
        icon: Archive,
    },
];

const AdminSidebar = () => {
    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader>
                <div className="flex items-center justify-center gap-5 px-3 pt-3">
                    <Image
                        src={"/images/logo.svg"}
                        alt="MAUNC"
                        width={50}
                        height={50}
                    />
                    <h1>Stapin MAUNC</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Admin</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton className="h-10" asChild>
                                        <Link
                                            href={`/admin${item.url}`}
                                            className="flex gap-4"
                                        >
                                            <item.icon
                                                className={"h-40 w-40"}
                                            />
                                            <span className="text-lg">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export default AdminSidebar;
