import React from "react";
import UserLayout from "~/components/layout/UserLayout";
import HistoryTabel from "~/components/profile/HistoryTabel";

const history = () => {
    return (
        <UserLayout>
            <h1>Riwayat Peminjaman</h1>
            <div className="flex w-full flex-col items-center justify-center">
                <HistoryTabel />
            </div>
        </UserLayout>
    );
};

export default history;
