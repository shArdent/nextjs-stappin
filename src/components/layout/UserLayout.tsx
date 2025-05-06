import React, { type PropsWithChildren } from "react";
import Navbar from "./common/Navbar";

const UserLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="h-full min-h-screen w-full bg-white">
            <Navbar />
            <div className="flex flex-col gap-8 px-20 py-10">{children}</div>
        </div>
    );
};

export default UserLayout;
