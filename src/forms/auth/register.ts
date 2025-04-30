import { z } from "zod";
import { emailSchema, passwordSchema } from "~/schemas/auth";

export const registerFormSchema = z
    .object({
        name: z.string(),
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Konfirmasi password tidak sesuai",
    });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
