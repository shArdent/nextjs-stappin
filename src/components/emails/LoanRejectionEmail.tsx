import {
    Html,
    Head,
    Preview,
    Heading,
    Text,
    Section,
    Container,
    Tailwind,
} from "@react-email/components";
import type { ReactElement } from "react";

type LoanRjectionEmailProps = {
    userName: string;
    loanId: string;
    alasan: string;
};

export const LoanRejectionEmail = ({
    userName,
    loanId,
    alasan,
}: LoanRjectionEmailProps): ReactElement => (
    <Html>
        <Head />
        <Preview>Mohon maaf, admin menolak pengajuan kamu</Preview>
        <Tailwind>
            <Container className="mx-auto max-w-xl rounded-xl bg-gray-100 p-6 shadow-md">
                <Section className="text-center">
                    <Heading className="text-2xl font-bold text-indigo-600">
                        📦 Notifikasi Peminjaman
                    </Heading>
                </Section>
                <Section className="mt-4 text-gray-800">
                    <Text>
                        Halo <strong>{userName}</strong>,
                    </Text>
                    <Text>
                        Peminjaman kamu dengan ID <strong>{loanId}</strong>{" "}
                        <span className="font-semibold text-red-600">
                            Belum bisa disetujui
                        </span>{" "}
                        dengan alasan {alasan}{" "}
                    </Text>
                    <Text>
                        Silakan lakukan kembali pengajuan yang sudah diperbaiki.
                    </Text>
                </Section>
                <Section className="mt-6 text-center text-sm text-gray-500">
                    &copy; 2025 Stappin — Sistem Peminjaman Barang IoT Lab Maunc
                </Section>
            </Container>
        </Tailwind>
    </Html>
);

export default LoanRejectionEmail;
