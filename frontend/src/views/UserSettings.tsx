import React, { useState } from "react";
import axiosClient from "../axios-client.tsx";
import { useStateContext } from "../contexts/ContextProvider.tsx";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

const UserSettings: React.FC = () => {
    const [aisIdFieldValue, setAisIdFieldValue] = useState("");
    const [password, setPassword] = useState("");
    const { user, setUser, setToken } = useStateContext();
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { t } = useTranslation();


    const handleAisIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAisIdFieldValue(e.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const payLoad = {
            username: aisIdFieldValue,
            password,
        };

        axiosClient.post("/ais/login", payLoad)
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
                toast.success(t('verificationEmailSent'));
                setLoading(false);
            })
            .catch(error => {
                const response = error.response;
                toast.success(t('verificationEmailFailed'));
                console.log(response.data.errors);
                setLoading(false);
            });

    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error(t('passwordMismatch'));
            return;
        }

        const payload = {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
        };

        axiosClient.post('/change-password', payload)
            .then(() => {
                toast.success(t('passwordChanged'));
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            })
            .catch(error => {
                const response = error.response;
                if (response && response.data.error) {
                    toast.error(response.data.error);
                }
            });
    };


    return (
        <div className="flex flex-col items-center bg-gray-100 py-8 px-4 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl flex flex-col space-y-4">
                {user?.employee_type != "teacher" &&(
                    <div className="flex flex-col  p-6">
                        <p className={`text-center font-semibold mb-4 ${user?.uid ? 'text-green-600' : 'text-red-600'}`}>
                            {user?.uid
                                ? `${t('currentlyVerifiedAIS')}: ${user.uid}`
                                : t('noAISVerified')}
                        </p>
                        <h2 className="text-2xl font-bold mb-6 text-center">{t('verifyAIS')}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-semibold mb-1">{t('aisID')}</label>
                                <input
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    type="text"
                                    value={aisIdFieldValue}
                                    onChange={handleAisIdChange}
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">{t('password')}</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                                    {t('verifyAIS')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                <div className="flex flex-col  p-6">
                    <h2 className="text-2xl font-bold mb-6 text-center">{t('changePassword')}</h2>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block font-semibold mb-1">{t('currentPassword')}</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">{t('newPassword')}</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">{t('confirmNewPassword')}</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                            {t('changePassword')}
                        </button>
                    </form>

                </div>
                {!user?.email_verified_at &&(

                    <div className="flex flex-col  p-6">
                        <p className={`text-center font-semibold mb-4 text-red-600`}>
                            {t('emailNotVerified')}
                        </p>
                        <button onClick={resendVerificationEmail} disabled={loading} className="w-full bg-blue-600 text-white text-lg py-2 px-4 rounded-md hover:bg-blue-700 transition">
                            {loading ? t('sending') : t('resendVerification')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSettings;