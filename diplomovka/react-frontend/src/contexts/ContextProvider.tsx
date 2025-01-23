import {createContext, useContext, useState} from "react";

const StateContext = createContext({
    token: String,
    setToken: () => {}
})

export const ContextProvider = ({children}) => {
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

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
        <StateContext.Provider value={{
            token,
            setToken
        }}>
            {children}

        </StateContext.Provider>
    );
}

export const  useStateContext = () => useContext(StateContext)
