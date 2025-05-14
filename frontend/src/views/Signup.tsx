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


                <p className="login-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
