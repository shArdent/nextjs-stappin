import { type AppType } from "next/app";
import { Geist } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { SidebarProvider } from "~/components/ui/sidebar";

const geist = Geist({
    subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <div className={geist.className}>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <SidebarProvider>
                    <Component {...pageProps} />
                </SidebarProvider>
                <Toaster />
            </ThemeProvider>
        </div>
    );
};

export default api.withTRPC(MyApp);
