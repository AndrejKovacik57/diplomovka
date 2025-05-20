import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.tsx";
import StudentHeader from "./StudentHeader.tsx";
import TeacherHeader from "./TeacherHeader.tsx";
import { ToastContainer } from "react-toastify";

export default function DefaultLayout() {
    const { user, token } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            {user?.employee_type === "teacher" ? <TeacherHeader /> : <StudentHeader />}
            <main className="flex-grow px-4 py-6 bg-gray-50">
                <Outlet />
            </main>
            <ToastContainer position="top-left" autoClose={3000} />
        </div>
    );
}
