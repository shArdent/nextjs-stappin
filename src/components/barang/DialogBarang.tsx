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
    type BarangInputSchema,
    barangInputSchema,
} from "~/forms/barang/inputSchema";
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
import { fileToBase64 } from "~/lib/utils";
import { useState } from "react";

export default function DialogInputBarang() {
    const [open, setOpen] = useState(false);
    const utils = api.useUtils();
    const form = useForm<BarangInputSchema>({
        resolver: zodResolver(barangInputSchema),
        defaultValues: {
            name: "",
            quantity: 0,
            description: "",
        },
    });

    const { mutate: submitInput, isPending: inputIsPending } =
        api.item.addNewItem.useMutation({
            onSuccess: async () => {
                toast.success("Berhasil menambahkan barang");
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

    const onInputSubmit = async (values: BarangInputSchema) => {
        const { image } = values;
        const base64 = await fileToBase64(image);
        const data = { ...values, image: base64 };
        submitInput(data);
    };

    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                <Button variant="yellow" onClick={() => setOpen(true)}>
                    Tambah Barang
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tambah Barang</DialogTitle>
                    <DialogDescription>
                        Tambahkan barang baru untuk peminjam
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onInputSubmit)}
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
                            name="image"
                            render={({ field: { onBlur, name, ref } }) => (
                                <FormItem>
                                    <FormLabel>Gambar Barang</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            name={name}
                                            ref={ref}
                                            onBlur={onBlur}
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    form.setValue(
                                                        "image",
                                                        file,
                                                        {
                                                            shouldValidate:
                                                                true,
                                                        },
                                                    );
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                disabled={inputIsPending}
                                onClick={() => setOpen(false)}
                                variant={"outline"}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={inputIsPending}
                                variant={"yellow"}
                            >
                                {inputIsPending ? "Loading.." : "Tambahkan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
