import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";

type Borrowing = {
    id: number;
    name: string;
    reason: string;
    items: string[];
    status: "approved" | "rejected";
    returnDate: string | null;
    verifiedBy: string;
};

const data: Borrowing[] = [
    {
        id: 1,
        name: "Diva Marshelano",
        reason: "Untuk kebutuhan praktikum perkuliahan",
        items: [
            "Raspebry Pi",
            "Kabel Jumper",
            "Sensor Inframerah",
            "Sensor Ultrasonik",
        ],
        status: "approved",
        returnDate: "25-04-2025",
        verifiedBy: "Admin123",
    },
    {
        id: 2,
        name: "Alya Azhar",
        reason: "Untuk kebutuhan praktikum perkuliahan",
        items: ["Raspebry Pi", "Kabel Jumper"],
        status: "rejected",
        returnDate: null,
        verifiedBy: "Admin123",
    },
    // Tambah data lainnya sesuai kebutuhan
];

export default function BorrowingTable() {
    return (
        <div className="rounded-xl border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Peminjam</TableHead>
                        <TableHead>Alasan</TableHead>
                        <TableHead>List Barang</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tanggal Pengembalian</TableHead>
                        <TableHead>Diverifikasi Oleh</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, idx) => (
                        <TableRow key={item.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.reason}</TableCell>
                            <TableCell>
                                <ul className="list-disc space-y-1 pl-4">
                                    {item.items.map((itm, i) => (
                                        <li key={i}>{itm}</li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell
                                className={
                                    item.status === "approved"
                                        ? "font-medium text-green-600"
                                        : "font-medium text-red-600"
                                }
                            >
                                {item.status === "approved"
                                    ? "Sudah Disetujui"
                                    : "Tidak Disetujui"}
                            </TableCell>
                            <TableCell>
                                {item.returnDate ?? (
                                    <span className="text-muted-foreground">
                                        -
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>{item.verifiedBy}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
