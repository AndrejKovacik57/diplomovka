import { Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.tsx";

import Header from "./DefaultHeader.tsx";
import "./Layout.css";
import "./DefaultLayout.css";
import StudentHeader from "./StudentHeader.tsx";


export default function DefaultLayout() {

    const {user,token} = useStateContext()

    console.log("Rendering DefaultLayout");

    if (!token){
        return <Navigate to={"/login"}/>
    }



    return(
        <div id="defaultLayout">
            {user?.employee_type === "teacher" ? <Header /> : <StudentHeader />}
            <div className="content">
                    <Outlet />
            </div>
        </div>
    )
}
