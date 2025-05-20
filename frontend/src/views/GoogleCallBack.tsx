import React, {useEffect} from "react";
import {useStateContext} from "../contexts/ContextProvider.tsx";
import axiosClient from "../axios-client.tsx";
import {useLocation} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Spinner from "../components/Spinner.tsx";

const GoogleCallBack: React.FC = () => {
    const {setUser, setToken} = useStateContext();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (window.location.pathname.includes('auth/google') &&  window.location.search.includes('error=access_denied')) {
            navigate('/login');
        }
        axiosClient.get(`/auth/callback${location.search}`, {
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

            console.log(response.data.errors);
        })
    }, [location.search, navigate, setToken, setUser]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <Spinner />
            </div>
        </div>
    );

}


export default GoogleCallBack;