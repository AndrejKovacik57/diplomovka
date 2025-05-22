// components/GuestHeader.tsx
import React from "react";
import { Link } from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.tsx";
import axiosClient from "../axios-client.tsx";



const Header = () => {

    const {user,setUser,setToken} = useStateContext();

    const onLogout = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault()

        axiosClient.post('/auth/logout')
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
                        <Link to="/exerciseManager" className="nav-item">Exercise</Link>
                    </li>
                    <li>
                        <Link to="/courseManager" className="nav-item">Course</Link>
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
