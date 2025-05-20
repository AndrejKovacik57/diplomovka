import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client.tsx";
import { useStateContext } from "../contexts/ContextProvider.tsx";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [loginUrl, setLoginUrl] = useState<string | null>(null);

    const { setUser, setToken } = useStateContext();

    useEffect(() => {
        axiosClient
            .get("/auth", {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })
            .then(({ data }) => {
                setLoginUrl(data.url);
            })
            .catch((error) => {
                const response = error.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setErrors({ general: ["Both fields are required"] });
            return;
        }

        setErrors({});
        const payLoad = { email, password };

        axiosClient
            .post("/login", payLoad)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((error) => {
                const response = error.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                } else if (response && response.status === 401) {
                    setErrors({ general: [response.data.error] });
                } else {
                    setErrors({ general: ["Something went wrong"] });
                }
            });
    };

    const handleGoogleLogin = () => {
        if (loginUrl != null) {
            window.location.href = loginUrl;
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6 px-4">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
                    >
                        Login
                    </button>

                    {Object.keys(errors).length > 0 && (
                        <div className="text-red-600 text-sm mt-2">
                            {Object.entries(errors).map(([key, messages]) => (
                                <ul key={key} className="list-disc list-inside">
                                    {messages.map((message, index) => (
                                        <li key={index}>{message}</li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    )}
                </form>

                <div className="my-6 border-t border-gray-200"></div>

                {loginUrl != null && (
                    <button
                        className="flex items-center justify-center gap-2 w-full border border-gray-300 text-black py-2 rounded-md hover:bg-blue-500 hover:text-white transition"
                        onClick={handleGoogleLogin}
                    >
                        <img
                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMy41MiAxMi4yNzI3QzIzLjUyIDExLjQyMTggMjMuNDQzNiAxMC42MDM2IDIzLjMwMTggOS44MTgxNkgxMlYxNC40NkgxOC40NTgyQzE4LjE4IDE1Ljk2IDE3LjMzNDUgMTcuMjMwOSAxNi4wNjM2IDE4LjA4MThWMjEuMDkyN0gxOS45NDE4QzIyLjIxMDkgMTkuMDAzNiAyMy41MiAxNS45MjczIDIzLjUyIDEyLjI3MjdaIiBmaWxsPSIjNDI4NUY0Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIgMjRDMTUuMjQgMjQgMTcuOTU2NCAyMi45MjU1IDE5Ljk0MTggMjEuMDkyN0wxNi4wNjM3IDE4LjA4MThDMTQuOTg5MSAxOC44MDE4IDEzLjYxNDYgMTkuMjI3MyAxMiAxOS4yMjczQzguODc0NTYgMTkuMjI3MyA2LjIyOTExIDE3LjExNjQgNS4yODU0NyAxNC4yOEgxLjI3NjM4VjE3LjM4OTFDMy4yNTA5MyAyMS4zMTA5IDcuMzA5MTEgMjQgMTIgMjRaIiBmaWxsPSIjMzRBODUzIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNS4yODU0NSAxNC4yOEM1LjA0NTQ1IDEzLjU2IDQuOTA5MDkgMTIuNzkwOSA0LjkwOTA5IDEyQzQuOTA5MDkgMTEuMjA5MSA1LjA0NTQ1IDEwLjQ0IDUuMjg1NDUgOS43MTk5OFY2LjYxMDg5SDEuMjc2MzZDMC40NjM2MzYgOC4yMzA4OSAwIDEwLjA2MzYgMCAxMkMwIDEzLjkzNjMgMC40NjM2MzYgMTUuNzY5MSAxLjI3NjM2IDE3LjM4OTFMNS4yODU0NSAxNC4yOFoiIGZpbGw9IiNGQkJDMDUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiA0Ljc3MjczQzEzLjc2MTggNC43NzI3MyAxNS4zNDM3IDUuMzc4MTggMTYuNTg3MyA2LjU2NzI3TDIwLjAyOTEgMy4xMjU0NUMxNy45NTA5IDEuMTg5MDkgMTUuMjM0NiAwIDEyIDBDNy4zMDkxMSAwIDMuMjUwOTMgMi42ODkwOSAxLjI3NjM4IDYuNjEwOTFMNS4yODU0NyA5LjcyQzYuMjI5MTEgNi44ODM2NCA4Ljg3NDU2IDQuNzcyNzMgMTIgNC43NzI3M1oiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+"
                            alt="Google"
                            className="h-5"
                        />
                        Login with Google
                    </button>
                )}

                <p className="text-sm text-center mt-4">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
