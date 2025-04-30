import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import UserLayout from "~/components/layout/UserLayout";
import { Button } from "~/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";

const updateUserSchema = z.object({
    name: z
        .string({ message: "Tidak boleh kosong" })
        .min(4, { message: "Minimal 4 karakter" }),
    phone: z.string().min(11, { message: "Nomor telepon tidak valid" }),
});

const index = () => {
    const util = api.useUtils();
    const { data } = api.auth.getUser.useQuery();

    const { mutate, isPending } = api.auth.updateUser.useMutation({
        onSuccess: () => {
            toast.success("Berhasil mengubah data");
            util.auth.getUser.invalidate;
        },
        onError: () => {
            toast.error("Gagal mengubah data");
        },
    });

    const updateData = (values: z.infer<typeof updateUserSchema>) => {
        mutate({
            name: values.name,
            phone: values.phone,
            email: data?.email as string,
        });
    };

    const form = useForm<z.infer<typeof updateUserSchema>>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: data?.name,
            phone: data?.phone ?? "",
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                name: data?.name,
                phone: data?.phone ?? "",
            });
        }
    }, [data, form]);

    return (
        <UserLayout>
            <div className="flex flex-col items-center justify-center">
                <h1 className="mb-5 text-xl font-bold">Edit Profil</h1>
                <Image
                    src={"/images/profil.svg"}
                    alt="profil"
                    width={150}
                    height={150}
                />
            </div>

            {!data ? (
                <Skeleton className="h-40 w-full" />
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(updateData)}
                        className="flex flex-col gap-4"
                    >
                        <Label htmlFor="email">Email</Label>

                        <Input
                            type="text"
                            id="email"
                            value={data?.email}
                            disabled
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="gap-2">
                                    <FormLabel>Nama</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage>
                                        {form.formState.errors.name?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="gap-2">
                                    <FormLabel>No Telepon</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage>
                                        {form.formState.errors.phone?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={isPending}
                            className="w-36 self-end"
                            variant={"yellow"}
                        >
                            Ubah
                        </Button>
                    </form>
                </Form>
            )}
        </UserLayout>
    );
};

export default index;
