import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { supabase } from "~/lib/supabase/client";

export const AuthRoute = (props: PropsWithChildren) => {
    const router = useRouter();

    const getUser = async () => {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
            router.push("/");
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return props.children;
};
