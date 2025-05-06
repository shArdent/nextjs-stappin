// emails/LoanConfirmationEmail.tsx
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

type LoanConfirmationEmailProps = {
    userName: string;
    loanId: string;
};

export const LoanConfirmationEmail = ({
    userName,
    loanId,
}: LoanConfirmationEmailProps): ReactElement => (
    <Html>
        <Head />
        <Preview>Peminjaman kamu sudah bisa diambil di lab</Preview>
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
                        sudah {" "}
                        <span className="font-semibold text-green-600">
                            dapat diambil
                        </span>{" "}
                        di ruangan lab.
                    </Text>
                    <Text>
                        Silakan ambil barang kamu dan bawa bukti peminjaman saat
                        pengambilan.
                    </Text>
                </Section>
                <Section className="mt-6 text-center text-sm text-gray-500">
                    &copy; 2025 Stappin — Sistem Peminjaman Barang IoT Lab Maunc
                </Section>
            </Container>
        </Tailwind>
    </Html>
);

export default LoanConfirmationEmail;
