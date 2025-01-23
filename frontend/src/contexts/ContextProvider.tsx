import {createContext, ReactNode, useContext, useState} from "react";

interface StateContextType {
    token: string | null;
    setToken: (token: string) => void;
}
// 3. Define props for the ContextProvider
interface ContextProviderProps {
    children: ReactNode; // ReactNode allows JSX children
}

const StateContext = createContext<StateContextType>({
    token: null ,
    setToken: () => {}
})

export const ContextProvider = ({children}:ContextProviderProps) => {
    const [token, _setToken] = useState<string | null>(localStorage.getItem('ACCESS_TOKEN'));


    const setToken = (token: string) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        }
        else{

            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    return (
        <StateContext.Provider value={{ token, setToken }}>
            {children}
        </StateContext.Provider>
    );
}

export const  useStateContext = () => useContext(StateContext)
