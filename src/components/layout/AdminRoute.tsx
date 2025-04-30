import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { supabase } from "~/lib/supabase/client";

export const AuthRoute = (props: PropsWithChildren) => {
    const router = useRouter();

    useEffect(() => {
        void (async function() {
            const { data } = await supabase.auth.getUser()
            if (!data.user || data.user.role) {
                await router.replace("/")
            }
        })
    }, [])


    return props.children
}
