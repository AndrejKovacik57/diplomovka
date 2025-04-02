import React, {useEffect} from "react";
import {useStateContext} from "../contexts/ContextProvider.tsx";
import axiosClient from "../axios-client.tsx";
import {useLocation} from "react-router-dom";

const GoogleCallBack: React.FC = () => {
    const {setUser, setToken} = useStateContext();
    const location = useLocation();

    useEffect(() => {axiosClient.get(`/auth/callback${location.search}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }})
        .then(({data}) => {
            console.log(data.user)
            setUser(data.user);
            setToken(data.token);
        })
        .catch(error =>{
            const response = error.response;
            if(response && response.status === 422){
                console.log(response.data.errors);
            }
        })
    }, [location.search, setToken, setUser]);

    return (
        <div>Google login ...</div>
    )
}


export default GoogleCallBack;