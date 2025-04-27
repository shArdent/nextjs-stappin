import { z } from "zod";

export const barangInputSchema = z.object({
    name: z.string({ message: "Harus berupa string" }),
    description: z.string({ message: "Harus berupa string" }),
    quantity: z
        .number({ message: "Harus Berupa angka" })
        .positive({ message: "Harus lebih dari 0" }),
    image: z
        .instanceof(File, {
            message: "File harus diupload terlebih dahulu",
        })
        .refine((file) => ["image/jpeg"].includes(file.type), {
            message: "Format file harus JPG",
        }),
});

export type BarangInputSchema = z.infer<typeof barangInputSchema>;
