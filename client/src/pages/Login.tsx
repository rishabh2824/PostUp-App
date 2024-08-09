import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { setAuthState } = useContext(AuthContext);
    let navigate = useNavigate();

    const login = () => {
        const data = { username, password };
        axios.post("http://localhost:3001/auth/login", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({ username: response.data.username, id: response.data.id, status: true, isLoading: false });
                navigate("/");
            }
        }).catch((error) => {
            console.error("There was an error logging in!", error);
        });
    };
    

    return (
        <div className="loginContainer">
            <label>Username:</label>
            <input
                type="text"
                onChange={(event) => setUsername(event.target.value)}
            />
            <label>Password:</label>
            <input
                type="password"
                onChange={(event) => setPassword(event.target.value)}
            />
            <button onClick={login}> Login </button>
        </div>
    );
};

export default Login;
