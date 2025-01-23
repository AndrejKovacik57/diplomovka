import {Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.tsx";

export default function GuestLayout() {
    const {token} = useStateContext()

    if (token){
        return <Navigate to={"/"}/>
    }

    return(
        <div>
            GuestLayout
            <Outlet/>
        </div>
    )
}
