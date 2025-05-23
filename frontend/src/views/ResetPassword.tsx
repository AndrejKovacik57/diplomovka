// ResetPassword.tsx
import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axiosClient from '../axios-client';
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

const ResetPassword: React.FC = () => {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const { t } = useTranslation();


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        axiosClient.post('/reset-password', {
            token,
            email,
            password,
            password_confirmation: passwordConfirmation,
        })
            .then(response =>toast.success(response.data.message || t('pwReset')))
            .catch(error => {
                if (error.response && error.response.data.error) {
                    console.log(error.response.data.error)
                    toast.error(error.response.data.error)
                } else {
                    toast.error(t('somethingWentWrong'))
                }
            });
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6 px-4">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
