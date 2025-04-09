import { createServerClient, serializeCookieHeader } from "@supabase/ssr";
import type { GetServerSidePropsContext } from "next";
import { createClient as createDefaultClient } from "@supabase/supabase-js";
import { env } from "~/env";

export const createSSRClient = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    const { req, res } = ctx;

    const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL!,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return Object.keys(req.cookies).map((name) => ({
                        name,
                        value: req.cookies[name] ?? "",
                    }));
                },
                setAll(cookiesToSet) {
                    res.setHeader(
                        "Set-cookie",
                        cookiesToSet.map(({ name, value, options }) =>
                            serializeCookieHeader(name, value, options),
                        ),
                    );
                },
            },
        },
    );
    return supabase;
};

export const supabaseAdminClient = createDefaultClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_ROLE_KEY!,
);
