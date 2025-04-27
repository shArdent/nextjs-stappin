import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { LoginFormSchema } from "~/forms/auth/login";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

type LoginFormInnerProps = {
    onLoginSubmit: (values: any) => void;
    isLoading?: boolean;
    buttonText?: string;
    showPassword?: boolean;
};

const LoginFromInner = (props: LoginFormInnerProps) => {
    const form = useFormContext<LoginFormSchema>();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <>
            <form
                onSubmit={form.handleSubmit(props.onLoginSubmit)}
                className="flex w-full flex-col gap-5"
            >
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
                    {props.isLoading ? "Loading.." : "Masuk"}
                </Button>
            </form>
        </>
    );
};

export default LoginFromInner;
