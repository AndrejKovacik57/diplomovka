import {Link, Outlet} from "react-router-dom";

export default function DefaultLayout() {


    const onLogout = (event:any) =>{
        event.preventDefault()
    }
    return(
        <div id="defaultLayout">
            <aside>
                <Link to={"/"}> Main page </Link>
                <Link to={"/create"}> Create exercise </Link>
                <Link to={"/display"}> Display exercise </Link>
                <Link to={"/solution"}> Display solution </Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        Header
                    </div>
                    <div>
                        User Info
                        <a href="#" onClick={onLogout} className={"btn-logout"}>Logout</a>
                    </div>
                </header>
                <main>
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}
