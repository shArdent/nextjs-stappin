import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { useState } from "react";
import type { Item } from "@prisma/client";
import { z } from "zod";

const updateSchema = z.object({
    name: z.string(),
    quantity: z.number(),
    description: z.string(),
    available: z.number(),
});

export default function DialogBarangUpdate({
    currentItem,
}: {
    currentItem: Item;
}) {
    const [open, setOpen] = useState(false);
    const utils = api.useUtils();
    const form = useForm<z.infer<typeof updateSchema>>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            name: currentItem.name,
            quantity: currentItem.quantity,
            description: currentItem.description ?? "",
            available: currentItem.available,
        },
    });

    const { mutate: submitUpdate, isPending: updateIsPending } =
        api.item.modifyItem.useMutation({
            onSuccess: async () => {
                toast.success("Berhasil mengedit data barang");
                await utils.item.getItems.invalidate();
                form.setValue("name", "");
                form.setValue("description", "");
                form.setValue("quantity", 0);
                setOpen(false);
            },
            onError: () => {
                toast.error("Gagal Menambahkan barang");
            },
        });

    const onUpdateSubmit = async (values: z.infer<typeof updateSchema>) => {
        const updated = { ...values, itemId: currentItem.id };
        submitUpdate(updated);
    };

    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    className="bg-green-400 hover:bg-green-400/70"
                    onClick={() => setOpen(true)}
                >
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Barang</DialogTitle>
                    <DialogDescription>
                        Ubah data barang yang tersedia
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onUpdateSubmit)}
                        className="flex flex-col gap-5"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="gap-2">
                                    <FormLabel>Nama Barang</FormLabel>
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
                            name="description"
                            render={({ field }) => (
                                <FormItem className="gap-2">
                                    <FormLabel>Deskripsi Barang</FormLabel>
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
                            name="quantity"
                            render={({ field }) => (
                                <FormItem className="gap-2">
                                    <FormLabel>Jumlah Barang</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(+e.target.value)
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="available"
                            render={({ field }) => (
                                <FormItem className="gap-2">
                                    <FormLabel>
                                        Jumlah Barang Tersedia
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(+e.target.value)
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                disabled={updateIsPending}
                                onClick={() => setOpen(false)}
                                variant={"outline"}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={updateIsPending}
                                variant={"yellow"}
                            >
                                {updateIsPending ? "Loading.." : "Edit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
