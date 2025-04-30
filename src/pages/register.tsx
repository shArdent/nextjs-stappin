import * as React from "react";

import { Form } from "~/components/ui/form";
import { RegisterFormInner } from "~/components/auth/RegisterFormInner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    registerFormSchema,
    type RegisterFormSchema,
} from "~/forms/auth/register";
import { api } from "~/utils/api";
import { toast } from "sonner";
import AuthLayout from "~/components/layout/AuthLayout";
import Link from "next/link";
import { useRouter } from "next/router";

function RegisterPage() {
    const router = useRouter();
    const form = useForm<RegisterFormSchema>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const { mutate: registerUser, isPending: registerUserIsPending } =
        api.auth.register.useMutation({
            onSuccess: () => {
                toast("Akun berhasil dibuat");
                form.setValue("email", "");
                form.setValue("password", "");
                router.push("/login");
            },
            onError: () => {
                toast.error("Terdapat kesalahan saat membuat akun");
            },
        });

    const handleRegisterSubmit = (values: RegisterFormSchema) => {
        registerUser(values);
    };

    return (
        <AuthLayout>
            <h1 className="text-center text-2xl font-bold">
                Masuk dengan Akun Stapin MAUNC
            </h1>
            <Form {...form}>
                <RegisterFormInner
                    isLoading={registerUserIsPending}
                    onRegisterSubmit={handleRegisterSubmit}
                    showPassword
                />
            </Form>
            <p className="font-semibold">
                Sudah punya akun ?{" "}
                <Link href={"/login"} className="text-red-600">
                    Masuk
                </Link>
            </p>
        </AuthLayout>
    );
}

export default RegisterPage;
