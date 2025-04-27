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

const AjukanDialog = ({
    cartData,
}: {
    cartData: Array<Prisma.CartGetPayload<{ include: { item: true } }>>;
}) => {
    console.log(cartData);
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="yellow" className="w-full">
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-accent-yellow hover:bg-accent-yellow/70 text-black">
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AjukanDialog;
