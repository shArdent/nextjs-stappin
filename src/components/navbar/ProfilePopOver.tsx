import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { toast } from "sonner";

const ProfilePopOver = () => {
    const { data } = api.auth.getUser.useQuery();
    const router = useRouter();

    const { mutate } = api.auth.logoutUser.useMutation({
        onSuccess: async () => {
            await router.replace("/login")
        },
        onError: () => {
            toast.error("Gagal melakukan logout")
        }
    });
    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    variant="outline"
                    className="flex h-full gap-4 px-5 py-2 text-sm"
                >
                    {data?.name}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-56 flex-col gap-4">
                <Link href="/profile" className="hover:underline">
                    Profil
                </Link>
                <Link href="/profile/history" className="hover:underline">
                    Riwayat Pinjam
                </Link>
                {data?.role === "ADMIN" && (
                    <Link href="/admin" className="hover:underline">
                        Admin Menu
                    </Link>
                )}
                <button
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        mutate();
                    }}
                    className="cursor-pointer text-left hover:underline"
                >
                    Logout
                </button>
            </PopoverContent>
        </Popover>
    );
};

export default ProfilePopOver;
