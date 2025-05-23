import React, { useState } from 'react';
import axiosClient from '../axios-client';
import { useTranslation } from 'react-i18next';
import {toast} from "react-toastify";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        axiosClient.post('/forgot-password', { email })
            .then(response =>toast.success(response.data.message))
            .catch(error => {
                if (error.response && error.response.data.error) {
                    toast.error(error.response.data.error)
                } else {
                    toast.error(t('somethingWentWrong'))
                }
            });
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6 px-4">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">{t('forgotPassword')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-1">{t('email')}</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
                    >
                        {t('submit')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
