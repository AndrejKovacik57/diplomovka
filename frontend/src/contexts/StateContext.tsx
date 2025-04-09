import { createContext, ReactNode, useState } from "react";

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

// Explicitly specify the default values for createContext
const StateContext = createContext<ContextType>({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
});

export const ContextProvider = ({ children }: ContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, _setToken] = useState<string | null>(localStorage.getItem("ACCESS_TOKEN"));

    const setToken = (token: string | null) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    return (
        <StateContext.Provider value={{ user, token, setUser, setToken }}>
            {children}
        </StateContext.Provider>
    );
};

export default StateContext;
