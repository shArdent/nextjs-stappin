import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import type { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { useRouter } from "next/router";

const AjukanDialog = ({
    loanData,
    cartData,
}: {
    loanData: {
        userId: string;
        reason: string;
        startDate: Date | undefined;
        returnedAt: Date | undefined;
    };
    cartData: Array<Prisma.CartGetPayload<{ include: { item: true } }>>;
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { mutate, isPending } = api.loan.borrow.useMutation({
        onSuccess: (data) => {
            toast.success("Berhasil melakukan pengajuan");
            router.push(`/loan/${data.loanId}`);
        },
        onError: () => {
            toast.error(
                "Terjadi masalah saat melakukan pengajuan, coba lagi nanti",
            );
        },
    });

    const [isData, setIsData] = useState<boolean>(false);

    const handleSubmit = () => {
        const mappedItem = cartData.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
        }));

        const itemList: [
            { itemId: string; quantity: number },
            ...{ itemId: string; quantity: number }[],
        ] = mappedItem as any;

        mutate({
            loan: {
                reason: loanData.reason,
                startAt: loanData.startDate as Date,
                returnedAt: loanData.returnedAt as Date,
            },
            reqItems: itemList,
        });
    };

    const isLoanDataComplete = (data: typeof loanData | undefined) => {
        if (!data) return false;
        return Object.values(data).every(
            (value) => value !== undefined && value !== "",
        );
    };

    useEffect(() => {
        setIsData(isLoanDataComplete(loanData) && cartData.length > 0);
    }, [loanData, cartData]);

    return (
        <AlertDialog open={open}>
            <AlertDialogTrigger asChild>
                <Button
                    disabled={!isData}
                    variant="yellow"
                    onClick={() => setOpen(true)}
                    className="w-full flex-1"
                >
                    Ajukan Peminjaman
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Anda yakin mengajukan peminjaman ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Periksa kembali dan pastikan barang yang anda ajukan ini
                        sudah benar.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button
                            disabled={isPending}
                            onClick={() => setOpen(false)}
                            className="text-black disabled:opacity-80"
                        >
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            onClick={handleSubmit}
                            disabled={!isData || isPending}
                            className="bg-accent-yellow hover:bg-accent-yellow/70 text-black"
                        >
                            {isPending ? "Loading..." : "Ajukan"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AjukanDialog;
