import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.tsx";
import { ToastContainer } from "react-toastify";
import ResponsiveHeader from "./ResponsiveHeader.tsx";

export default function DefaultLayout() {
    const { user, token } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex flex-col min-h-screen min-w-[400px]">
            {user?.employee_type === "teacher" ?
                <ResponsiveHeader role="teacher" />
                : <ResponsiveHeader role="student" />}
            <main className="flex-grow px-4 py-6 bg-gray-50">
                <Outlet />
            </main>
            <ToastContainer position="top-left" autoClose={3000} />
        </div>
    );
}
