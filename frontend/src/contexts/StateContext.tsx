import { createContext, ReactNode, useEffect, useState } from "react";
import axiosClient from "../axios-client.tsx"; // adjust the path if needed

interface ContextProviderProps {
    children: ReactNode;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    stuba_email: string;
    uid: string;
    uisid: number;
    employee_type: string;
    google_id: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface ContextType {
    user: User | null;
    token: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
}

// Default context values
const StateContext = createContext<ContextType>({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
});

export const ContextProvider = ({ children }: ContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, _setToken] = useState<string | null>(localStorage.getItem("ACCESS_TOKEN"));
    const [loading, setLoading] = useState(true);

    const setToken = (token: string | null) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data);
            })
            .catch(() => {
                setToken(null); // Clear token if unauthorized
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token]);

    if (loading) {
        return (
            <div className="layout-loading">
                <div className="spinner-container">
                    <div className="spinner" />
                </div>
            </div>
        );
    }

    return (
        <StateContext.Provider value={{ user, token, setUser, setToken }}>
            {children}
        </StateContext.Provider>
    );
};

export default StateContext;
