import { type PropsWithChildren } from "react";
import AdminSidebar from "../common/AdminSidebar";

const AdminLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="flex w-full">
            <AdminSidebar />
            {children}
        </div>
    );
};

export default AdminLayout;
