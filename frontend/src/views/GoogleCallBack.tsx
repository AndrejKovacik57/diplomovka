import React, {useEffect, useState} from "react";
import {useStateContext} from "../contexts/ContextProvider.tsx";
import axiosClient from "../axios-client.tsx";
import {useLocation} from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const GoogleCallBack: React.FC = () => {
    const {setUser, setToken} = useStateContext();
    const location = useLocation();
    const [dots, setDots] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? "" : prev + ".");
        }, 300);  // Change speed here (500ms)

        return () => clearInterval(interval);  // Cleanup on unmount
    }, []);

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
            if(response && response.status === 422){
            }
        })
    }, [location.search, setToken, setUser]);

    return (
        <div className="container">
            <div className="box">
                <h2>Google login <span style={{ display: "inline-block", width: "3ch", textAlign: "left" }}>{dots}</span></h2>
            </div>
        </div>
    )
}


export default GoogleCallBack;