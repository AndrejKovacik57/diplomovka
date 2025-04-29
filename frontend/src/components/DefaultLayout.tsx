import { Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.tsx";

import Header from "./DefaultHeader.tsx";
import "./Layout.css";
import "./DefaultLayout.css";
import {useEffect} from "react";
import axiosClient from "../axios-client.tsx";
import StudentHeader from "./StudentHeader.tsx";


export default function DefaultLayout() {

    const {user,setUser,token, setToken} = useStateContext()

    useEffect(() => {
        if (!token) return;

        axiosClient.get('/user')
            .then(({ data }) => {
                console.log(data)
                setUser(data);
            })
            .catch(error => {
                console.log(error.response);
                if (error.response.status === 401) {
                    setToken(null);
                }
            });
    }, [token]); // Dependency on token to conditionally run logic

    if (!token){
        return <Navigate to={"/login"}/>
    }



    return(
        <div id="defaultLayout">
            {user?.employee_type === "teacher" ? <Header /> : <StudentHeader />}
            <div className="content">
                <Outlet/>
            </div>
        </div>
    )
}
