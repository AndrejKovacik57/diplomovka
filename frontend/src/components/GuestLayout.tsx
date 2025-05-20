import {Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.tsx";
import Header from "./GuestHeader.tsx";

export default function GuestLayout() {
    const {token} = useStateContext()
    console.log("Rendering GuestLayout");
    if (token){
        return <Navigate to={"/"}/>
    }

    return(
        <div className="flex flex-col min-h-screen">
        <Header/>
            <main className="flex-grow px-4 py-6 bg-gray-50">
                <Outlet />
            </main>
        </div>
    )
}
