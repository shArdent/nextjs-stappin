import React, { type PropsWithChildren } from "react";
import Navbar from "./common/Navbar";
import { AuthRoute } from "./AuthRoute";

const UserLayout = ({ children }: PropsWithChildren) => {
    return (
        <AuthRoute>
            <div className="h-full min-h-screen w-full bg-white">
                <Navbar />
                <div className="flex w-full flex-col gap-5 px-20 py-10">
                    {children}
                </div>
            </div>
        </AuthRoute>
    );
};

export default UserLayout;
