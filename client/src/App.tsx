import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { AuthContext } from "./helpers/AuthContext";

const App: React.FC = () => {
    const [authState, setAuthState] = useState({ username: "", id: 0, status: false });

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        console.log("Access token from localStorage:", token);
        axios
            .get("http://localhost:3001/auth/auth", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            .then((response) => {
                if (response.data.error) {
                    setAuthState({ ...authState, status: false });
                } else {
                    setAuthState({
                        username: response.data.username,
                        id: response.data.id,
                        status: true,
                    });
                }
            })
            .catch((error) => {
                console.log("Auth request error:", error.message);
            });
    }, []);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({ username: "", id: 0, status: false });
    };

    return (
        <div className="App">
            <AuthContext.Provider value={{ authState, setAuthState }}>
                <Router>
                    <nav className="navbar">
                        <div className="links">
                            <Link to="/">Home Page</Link>
                            <Link to="/createpost">Create A Post</Link>
                            {!authState.status && (
                                <>
                                    <Link to="/login">Login</Link>
                                    <Link to="/registration">Registration</Link>
                                </>
                            )}
                        </div>
                        {authState.status && (
                            <div className="user-info">
                                <span className="username">{authState.username}</span>
                                <button onClick={logout}>Logout</button>
                            </div>
                        )}
                    </nav>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/createpost" element={<CreatePost />} />
                        <Route path="/post/:id" element={<Post />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registration" element={<Registration />} />
                    </Routes>
                </Router>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
