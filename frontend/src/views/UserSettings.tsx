import React, { useState } from "react";
import axiosClient from "../axios-client.tsx";
import { useStateContext } from "../contexts/ContextProvider.tsx";
import {toast} from "react-toastify";

const UserSettings: React.FC = () => {
    const [aisIdFieldValue, setAisIdFieldValue] = useState("");
    const [password, setPassword] = useState("");
    const { user, setUser, setToken } = useStateContext();
    const [loading, setLoading] = useState(false);

    const handleAisIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAisIdFieldValue(e.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const payLoad = {
            username: aisIdFieldValue,
            password,
        };

        axiosClient.post("/aislog", payLoad)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch(error => {
                const response = error.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    };
    const resendVerificationEmail = async () => {
        setLoading(true);
        axiosClient.post("/email/verification-notification", {})
            .then(( ) => {
                toast.success("Verification email sent!");
                setLoading(false);
            })
            .catch(error => {
                const response = error.response;
                toast.success("Verification email failed to send!");
                console.log(response.data.errors);
                setLoading(false);
            });

    };

    return (
        <div className="flex flex-col items-center bg-gray-100 py-8 px-4 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl flex flex-col space-y-4">
                <div className="flex flex-col  p-6">
                    <p className={`text-center font-semibold mb-4 ${user?.uid ? 'text-green-600' : 'text-red-600'}`}>
                        {user?.uid
                            ? `Currently linked to AIS account: ${user.uid}`
                            : "Currently no AIS account is linked"}
                    </p>
                    <h2 className="text-2xl font-bold mb-6 text-center">Link AIS Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-semibold mb-1">AIS ID:</label>
                            <input
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                type="text"
                                value={aisIdFieldValue}
                                onChange={handleAisIdChange}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Password:</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                                Link Account
                            </button>
                        </div>
                    </form>
                </div>
                {!user?.email_verified_at &&(

                    <div className="flex flex-col  p-6">
                        <p className={`text-center font-semibold mb-4 text-red-600`}>
                            Email is not verified!
                        </p>
                        <button onClick={resendVerificationEmail} disabled={loading} className="w-full bg-blue-600 text-white text-lg py-2 px-4 rounded-md hover:bg-blue-700 transition">
                            {loading ? 'Sending...' : 'Resend Verification Email'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSettings;