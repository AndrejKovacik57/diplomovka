import React from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.tsx";
import axiosClient from "../axios-client.tsx";

const TeacherHeader = () => {
    const { user, setUser, setToken } = useStateContext();

    const onLogout = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        axiosClient.post("/auth/logout").then(() => {
            setUser(null);
            setToken(null);
        });
    };

    return (
        <header className="shadow-md flex flex-col md:flex-row justify-between items-center px-4 py-3 bg-white">
            <Link to="/" className="text-lg font-bold text-black hover:underline">
                Home
            </Link>
            <nav className="my-2 md:my-0">
                <ul className="flex flex-col md:flex-row gap-2 md:gap-4">
                    <li>
                        <Link
                            to="/exerciseManager"
                            className="text-black px-4 py-2 rounded hover:bg-gray-100 hover:shadow-md transition"
                        >
                            Exercise
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/courseManager"
                            className="text-black px-4 py-2 rounded hover:bg-gray-100 hover:shadow-md transition"
                        >
                            Course
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="flex flex-col md:flex-row items-center gap-2">
                <h3 className="text-sm font-medium whitespace-nowrap">Hello {user?.first_name}</h3>
                <button
                    className="bg-white border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-100 hover:shadow-md transition"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default TeacherHeader;