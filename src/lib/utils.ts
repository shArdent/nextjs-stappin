import type { LoanStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export const textStyle = (status: LoanStatus) => {
    switch (status) {
        case "PENDING":
            return "text-yellow-500";
        case "APPROVED":
            return "text-green-500";
        case "REJECTED":
            return "text-red-500";
        case "RETURNED":
            return "text-blue-500";
    }
};
