import {Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.tsx";
import Header from "./GuestHeader.tsx";
import "./Layout.css";
import "./GuestLayout.css";

export default function GuestLayout() {
    const {token} = useStateContext()
    console.log("Rendering GuestLayout");
    if (token){
        return <Navigate to={"/"}/>
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
