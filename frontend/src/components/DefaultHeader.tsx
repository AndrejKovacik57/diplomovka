// components/GuestHeader.tsx
import React from "react";
import { Link } from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.tsx";
import axiosClient from "../axios-client.tsx";



const Header = () => {

    const {user,token,setUser,setToken} = useStateContext();
    console.log(user);
    console.log(token);

    const onLogout = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault()

        axiosClient.post('/logout')
            .then(() => {
                setUser(null)
                setToken(null)
            })
    }

    return (
        <header className="header-shadow">
            <h1 className="app-name">MyApp</h1>
            <nav>
                <ul className="">
                    <li>
                        <Link to="/" className="nav-item">Home</Link>
                    </li>
                    <li>
                        <Link to="/create" className="nav-item">Create exercise</Link>
                    </li>
                    <li>
                        <Link to="/course" className="nav-item">Create course</Link>
                    </li>
                    <li>
                        <Link to="/display" className="nav-item">Display exercise</Link>
                    </li>
                    <li>
                        <Link to="/solution" className="nav-item">Display solution</Link>
                    </li>
                    <li>
                        <Link to="/displayCourse" className="nav-item">Display courses</Link>
                    </li>
                    <li>
                        <Link to="/settings" className="nav-item">Settings</Link>
                    </li>
                </ul>
            </nav>
            <div className="user-info">
                <h3 className="user-name">Hello {user?.first_name}</h3>
                <button className="btn-logout" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
