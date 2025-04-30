import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { RegisterFormSchema } from "~/forms/auth/register";
import { Button } from "~/components/ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

type RegisterFormInnerProps = {
    onRegisterSubmit: (values: any) => void;
    isLoading?: boolean;
    buttonText?: string;
    showPassword?: boolean;
};

export const RegisterFormInner = (props: RegisterFormInnerProps) => {
    const form = useFormContext<RegisterFormSchema>();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <>
            <form
                onSubmit={form.handleSubmit(props.onRegisterSubmit)}
                className="flex w-full flex-col gap-5"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="gap-2">
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="gap-2">
                            <FormLabel>Alamat Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="gap-2">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem className="gap-2">
                            <FormLabel>Konfirmasi Password</FormLabel>
                            <FormControl>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {props.showPassword && (
                    <Label className="mt-4 flex items-center gap-2">
                        <Checkbox
                            checked={showPassword}
                            onCheckedChange={(checked) =>
                                setShowPassword(!!checked)
                            }
                        />
                        Show Password
                    </Label>
                )}

                <Button
                    disabled={props.isLoading}
                    className={`cursor-pointer disabled:opacity-70`}
                    type="submit"
                >
                    {props.isLoading ? "Loading.." : "Daftar"}
                </Button>
            </form>
        </>
    );
};
