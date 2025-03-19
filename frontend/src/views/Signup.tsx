import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client.tsx";
import {useStateContext} from "../contexts/ContextProvider.tsx";

const Signup: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const {setUser, setToken} = useStateContext()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setErrors({ general: ["All fields are required"] });
            return;
        }

        if (password !== confirmPassword) {
            setErrors({ password: ["Passwords do not match"] });
            return;
        }

        setErrors({}); // Reset errors before sending request
        // alert(`First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nPassword: ${password}`);

        const payLoad = {
            firstName,
            lastName,
            email,
            password,
            'password_confirmation': confirmPassword
        }

        console.log(payLoad);
        axiosClient.post('/signup', payLoad)
        .then(({data}) => {
            console.log(data)
            setUser(data.user);
            setToken(data.token);

        })
        .catch(error =>{
            const response = error.response;
            if(response && response.status === 422){
                console.log(response.data.errors);
                setErrors(response.data.errors);
            }
        })


    };

    const handleGoogleRegister = () => {
        alert("Google register clicked");
    };

    return (
        <div className="container">
            <div className="box">
                <h2 className="form-title">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        Register
                    </button>

                    {Object.keys(errors).length > 0 && (
                        <div className="error-message">
                            {Object.entries(errors).map(([key, messages]) => (
                                <ul key={key}>
                                    {messages.map((message, index) => (
                                        <li key={index}>{message}</li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    )}
                </form>
                <hr/>
                <button className="btn-google" onClick={handleGoogleRegister}>
                    <img
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMy41MiAxMi4yNzI3QzIzLjUyIDExLjQyMTggMjMuNDQzNiAxMC42MDM2IDIzLjMwMTggOS44MTgxNkgxMlYxNC40NkgxOC40NTgyQzE4LjE4IDE1Ljk2IDE3LjMzNDUgMTcuMjMwOSAxNi4wNjM2IDE4LjA4MThWMjEuMDkyN0gxOS45NDE4QzIyLjIxMDkgMTkuMDAzNiAyMy41MiAxNS45MjczIDIzLjUyIDEyLjI3MjdaIiBmaWxsPSIjNDI4NUY0Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIgMjRDMTUuMjQgMjQgMTcuOTU2NCAyMi45MjU1IDE5Ljk0MTggMjEuMDkyN0wxNi4wNjM3IDE4LjA4MThDMTQuOTg5MSAxOC44MDE4IDEzLjYxNDYgMTkuMjI3MyAxMiAxOS4yMjczQzguODc0NTYgMTkuMjI3MyA2LjIyOTExIDE3LjExNjQgNS4yODU0NyAxNC4yOEgxLjI3NjM4VjE3LjM4OTFDMy4yNTA5MyAyMS4zMTA5IDcuMzA5MTEgMjQgMTIgMjRaIiBmaWxsPSIjMzRBODUzIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNS4yODU0NSAxNC4yOEM1LjA0NTQ1IDEzLjU2IDQuOTA5MDkgMTIuNzkwOSA0LjkwOTA5IDEyQzQuOTA5MDkgMTEuMjA5MSA1LjA0NTQ1IDEwLjQ0IDUuMjg1NDUgOS43MTk5OFY2LjYxMDg5SDEuMjc2MzZDMC40NjM2MzYgOC4yMzA4OSAwIDEwLjA2MzYgMCAxMkMwIDEzLjkzNjMgMC40NjM2MzYgMTUuNzY5MSAxLjI3NjM2IDE3LjM4OTFMNS4yODU0NSAxNC4yOFoiIGZpbGw9IiNGQkJDMDUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiA0Ljc3MjczQzEzLjc2MTggNC43NzI3MyAxNS4zNDM3IDUuMzc4MTggMTYuNTg3MyA2LjU2NzI3TDIwLjAyOTEgMy4xMjU0NUMxNy45NTA5IDEuMTg5MDkgMTUuMjM0NiAwIDEyIDBDNy4zMDkxMSAwIDMuMjUwOTMgMi42ODkwOSAxLjI3NjM4IDYuNjEwOTFMNS4yODU0NyA5LjcyQzYuMjI5MTEgNi44ODM2NCA4Ljg3NDU2IDQuNzcyNzMgMTIgNC43NzI3M1oiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+Cg=="
                        className="google-icon" alt="Google"/>
                    Register with Google
                </button>

                <p className="login-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
