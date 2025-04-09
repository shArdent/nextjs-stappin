import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { RegisterFormSchema } from "../forms/register";
import { Button } from "~/components/ui/button";

type RegisterFormInnerProps = {
    onRegisterSubmit: (values: any) => void;
    isLoading?: boolean;
    buttonText?: string;
    showPassword?: boolean
}

export const RegisterFormInner = (props: RegisterFormInnerProps) => {
    const form = useFormContext<RegisterFormSchema>()
    const [showPassowrd, setShowPassword] = useState<boolean>(false)

    return (
        <form onSubmit={form.handleSubmit(props.onRegisterSubmit)} className="flex flex-col gap-3">
            <FormField control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem className="gap-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem className="gap-2">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type={showPassowrd ? "text" : "password"} {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button className="cursor-pointer" type="submit">Daftar</Button>
        </form>
    )
}


