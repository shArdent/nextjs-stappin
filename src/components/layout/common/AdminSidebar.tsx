import { Archive, Database, Inbox, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar";
import { api } from "~/utils/api";

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
    const router = useRouter();

    const { mutate } = api.auth.logoutUser.useMutation();
    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader>
                <Link
                    href={"/catalog"}
                    className="flex items-center justify-center gap-5 px-3 pt-3"
                >
                    <Image
                        src={"/images/logo.svg"}
                        alt="MAUNC"
                        width={50}
                        height={50}
                    />
                    <h1>Stapin MAUNC</h1>
                </Link>
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
                <SidebarFooter>
                    <Button
                        onClick={async () => {
                            mutate();
                            router.push("/login");
                        }}
                        variant={"yellow"}
                    >
                        Logout
                    </Button>
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    );
};

export default AdminSidebar;
