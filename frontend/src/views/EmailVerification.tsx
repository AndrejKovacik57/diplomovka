import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from "../axios-client.tsx";
import { useStateContext } from "../contexts/ContextProvider.tsx";
import { toast } from "react-toastify";

function EmailVerification() {
    const query = new URLSearchParams(location.search);
    const { id, hash } = useParams();
    const { user, token, setUser } = useStateContext();
    const expires = query.get('expires');
    const signature = query.get('signature');

    const [status, setStatus] = useState('verifying'); // verifying | success | already_verified | failed

    useEffect(() => {
        if (user) {
            if (user.email_verified_at) {
                toast.info("Email already verified.");
                setStatus('already_verified');
                return;
            }

            axiosClient.get(`email/verify/${id}/${hash}`, {
                params: {
                    expires,
                    signature
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    const updatedUser = response.data.user;
                    setUser(updatedUser);
                    toast.success("Email verified!");
                    setStatus('success');
                })
                .catch(error => {
                    console.error('Verification error:', error);
                    toast.error("Email failed to verify!");
                    setStatus('failed');
                });
        }
    }, [user, token, id, hash, expires, signature, setUser]);

    let message = "Verifying your email...";
    if (status === 'success') message = "Email was verified.";
    if (status === 'already_verified') message = "Email is already verified.";
    if (status === 'failed') message = "Email verification failed.";

    return (
        <div className="flex justify-center p-4 md:p-8">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow p-6 md:p-10">
                <div>{message}</div>
            </div>
        </div>
    );
}

export default EmailVerification;
