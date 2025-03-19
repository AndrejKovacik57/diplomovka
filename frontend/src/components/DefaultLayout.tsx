import { Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.tsx";

import Header from "./DefaultHeader.tsx";
import "./Layout.css";
import "./DefaultLayout.css";
import {useEffect} from "react";
import axiosClient from "../axios-client.tsx";


export default function DefaultLayout() {

    const {setUser,token} = useStateContext()

    useEffect(() => {
        if (!token) return;

        axiosClient.get('/user')
            .then(({ data }) => {
                console.log(data);
                setUser(data);
            })
            .catch(error => {
                console.log(error.response);
            });
    }, [token]); // Dependency on token to conditionally run logic

    if (!token){
        return <Navigate to={"/login"}/>
    }


    return(
        <div id="defaultLayout">
            <Header/>
            <div className="content">
                <Outlet/>
            </div>
        </div>
    )
}
