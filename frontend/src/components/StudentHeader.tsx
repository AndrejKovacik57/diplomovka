// components/GuestHeader.tsx
import React from "react";
import { Link } from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.tsx";
import axiosClient from "../axios-client.tsx";



const StudentHeader = () => {

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

            <Link to="/" className="nav-item"><h1>Home</h1></Link>
            <nav>
                <ul className="">
                    <li>
                        <Link to="/studentExercises" className="nav-item">Exercises</Link>
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

export default StudentHeader;
