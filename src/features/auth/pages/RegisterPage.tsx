import * as React from "react"
import { GuestRoute } from "~/components/layout/GuestRoute"
import { PageContainer } from "~/components/layout/PageContainer"
import { SectionContainer } from "~/components/layout/SectionContainer"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Form } from "~/components/ui/form"
import { RegisterFormInner } from "../components/RegisterFormInner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerFormSchema, type RegisterFormSchema } from "../forms/register"
import { api } from "~/utils/api"
import { toast } from "sonner"
function RegisterPage() {

    const form = useForm<RegisterFormSchema>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const { mutate: registerUser, isPending: registerUserIsPending } = api.auth.register.useMutation({
        onSuccess: () => {
            toast("Akun berhasil dibuat")
            form.setValue("email", "")
            form.setValue("password", "")
        },
        onError: () => {
            toast.error("Terdapat kesalahan saat membuat akun")
        }
    })

    const handleRegisterSubmit = (values: RegisterFormSchema) => {
        console.log(values)
        registerUser(values)
    }

    return (
        <GuestRoute>
            <PageContainer>
                <SectionContainer padded className="flex min-h-[calc(100vh-144px)] w-full flex-col justify-center items-center">
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Buat akun anda</CardTitle>
                            <CardDescription>Buat project IoT-mu sekarang juga!</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <RegisterFormInner isLoading={registerUserIsPending} onRegisterSubmit={handleRegisterSubmit} showPassword />

                            </Form>
                        </CardContent>
                        <CardFooter className="flex justify-between">

                        </CardFooter>
                    </Card>
                </SectionContainer>
            </PageContainer>
        </GuestRoute>
    )
}

export default RegisterPage
