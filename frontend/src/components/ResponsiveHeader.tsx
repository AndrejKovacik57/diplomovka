import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

const ResponsiveHeader = ({ role }: { role: "guest" | "student" | "teacher" }) => {
    const { user, setUser, setToken } = useStateContext();
    const [menuOpen, setMenuOpen] = useState(false);

    const onLogout = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        axiosClient.post("/logout").then(() => {
            setUser(null);
            setToken(null);
        });
    };

    const navLinks = {
        guest: [
            { path: "/login", label: "Login" },
            { path: "/signup", label: "Sign Up" },
        ],
        student: [
            { path: "/exercises", label: "Exercises" },
            { path: "/solution", label: "Solutions" },
            { path: "/settings", label: "Settings" },
        ],
        teacher: [
            { path: "/exerciseManager", label: "Exercise" },
            { path: "/courseManager", label: "Course" },
        ],
    };

    return (
        <header className={`shadow-md bg-white px-4 py-3 flex justify-between items-center`}>

        <Link to="/" className="text-xl font-bold">MyApp</Link>

            {/* Burger Button */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden block focus:outline-none"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {menuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Nav Links */}
            <nav
                className={`${
                    menuOpen ? "block" : "hidden"
                } md:flex md:items-center md:gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white shadow-md md:shadow-none z-50 ${
                    role === "guest" ? "text-center items-center" : ""
                }`}
            >

                <ul className={`flex flex-col md:flex-row gap-2 md:gap-4 p-4 md:p-0 ${role === "guest" ? "md:mx-auto" : ""}`}>

                {navLinks[role].map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className="text-black px-4 py-2 rounded hover:bg-gray-100 hover:shadow-md transition block text-center"
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    {user && (
                        <li className="md:hidden">
                            <button
                                onClick={(e) => {
                                    onLogout(e);
                                    setMenuOpen(false); // Close menu after logout
                                }}
                                className="bg-white border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100 hover:shadow-md transition block w-full text-center"
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>

            </nav>

            {user && (
                <div className="hidden md:flex items-center gap-4">
                    <span className="text-sm font-medium">Hello {user.first_name}</span>
                    <button
                        onClick={onLogout}
                        className="bg-white border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100 hover:shadow-md transition"
                    >
                        Logout
                    </button>
                </div>
            )}

        </header>
    );
};

export default ResponsiveHeader;
