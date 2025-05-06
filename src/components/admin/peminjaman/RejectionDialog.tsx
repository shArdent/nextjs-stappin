import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Label } from "~/components/ui/label";
import { api } from "~/utils/api";

const RejectionDialog = ({ id }: { id: string }) => {
    const [alasan, setAlasan] = useState<string>("");

    const util = api.useUtils();

    const { mutate: reject, isPending: rejectIsPending } =
        api.loan.rejectLoanReqById.useMutation({
            onSuccess: () => {
                toast.success("Berhasil menolak peminjaman");
                util.loan.getPendingLoan.invalidate();
            },
            onError: () => {
                toast.error("Gagal menolak peminjmaan");
            },
        });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Tolak</Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Alasan penolakan</DialogTitle>
                    <DialogDescription>
                        Berikan alasan untuk penolakan ini kepada peminjam
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 py-4">
                    <Label htmlFor="alasan" className="text-right">
                        Alasan
                    </Label>
                    <Input
                        onChange={(e) => setAlasan(e.target.value)}
                        id="alasan"
                        className="col-span-3"
                        placeholder="alasan penolakan"
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant={"destructive"}
                        type="submit"
                        onClick={() => reject({ loanId: id, alasan })}
                    >
                        Tolak pengajuan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RejectionDialog;
