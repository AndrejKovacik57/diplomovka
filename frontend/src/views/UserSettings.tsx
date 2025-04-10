import React, {useState} from "react";
import axiosClient from "../axios-client.tsx";
import {useStateContext} from "../contexts/ContextProvider.tsx";


const UserSettings: React.FC = () => {
    const [aisIdFieldValue, setAisIdFieldValue] = useState("");
    const [password, setPassword] = useState("");
    const {user, setUser,setToken} = useStateContext();
    console.log(user?.uid)
    const handleAisIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAisIdFieldValue(e.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()

        const payLoad = {
            'username':aisIdFieldValue,
            password
        }
        console.log('payload ', payLoad);
        // debugging
        axiosClient.post('/aislog', payLoad)
            .then(({data}) => {
                console.log(data)
                setUser(data.user);
                setToken(data.token);
            })
            .catch(error =>{
                const response = error.response;
                console.log('error ', response)
                if(response && response.status === 422){
                    console.log(response.data.errors);
                }

            })
    };
    return (
        <div className="container">
            <div className="user-box">
                {user?.uid ? (
                    <p style={{ color: 'green' }}>
                        Currently linked to AIS account: {user.uid}
                    </p>
                ) : (
                    <p style={{ color: 'red' }}>
                        Currently no AIS account is linked
                    </p>
                )}
                <h2 className="form-title">Link AIS account </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>AIS ID:</label>
                        <input
                            className="input-field"
                            type="text"
                            value={aisIdFieldValue}
                            onChange={handleAisIdChange}
                        />
                    </div>
                    <div className="form-group">
                        <label >Password:</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserSettings;