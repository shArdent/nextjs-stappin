import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import LoginFromInner from "~/components/auth/LoginFromInner";
import AuthLayout from "~/components/layout/AuthLayout";
import { Form } from "~/components/ui/form";
import { loginFormSchema, type LoginFormSchema } from "~/forms/auth/login";
import { supabase } from "~/lib/supabase/client";
import { type AuthError } from "@supabase/supabase-js";
import { SupabaseAuthErrorCode } from "~/lib/supabase/authErrorCodes";
import { toast } from "sonner";
import Link from "next/link";

const login = () => {
    const router = useRouter();
    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLoginSubmit = async (values: LoginFormSchema) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) throw error;

            await router.replace("/catalog");
        } catch (error) {
            console.log(error);
            switch ((error as AuthError).code) {
                case SupabaseAuthErrorCode.invalid_credentials:
                    form.setError("email", {
                        message: "Email atau password salah",
                    });
                    form.setError("password", {
                        message: "Email atau password salah",
                    });
                case SupabaseAuthErrorCode.email_not_confirmed:
                    form.setError("email", {
                        message: "Email belum diverifikasi",
                    });
                default:
                    toast.error("Terjadi kesalahan, coba beberapa saat lagi");
            }
        }
    };

    return (
        <AuthLayout>
            <h1 className="text-center text-2xl font-bold">
                Masuk dengan Akun Stapin MAUNC
            </h1>
            <Form {...form}>
                <LoginFromInner
                    onLoginSubmit={handleLoginSubmit}
                    showPassword
                />
            </Form>
            <p className="font-semibold">
                Belum punya akun ?{" "}
                <Link href={"/register"} className="text-red-600">
                    Daftar
                </Link>
            </p>
        </AuthLayout>
    );
};

export default login;
