import {Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.tsx";

export default function DefaultLayout() {
    const {token} = useStateContext()

    if (!token){
        return <Navigate to={"/"}/>
    }

    return(
        <div>
            DefaultLayout
            <Outlet/>
        </div>
    )
}
