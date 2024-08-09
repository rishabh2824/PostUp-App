import React, { createContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";

interface AuthState {
    username: string;
    id: number;
    status: boolean;
    isLoading: boolean;
}

interface AuthContextType {
    authState: AuthState;
    setAuthState: Dispatch<SetStateAction<AuthState>>;
}

// Provide default values
export const AuthContext = createContext<AuthContextType>({
    authState: { username: "", id: 0, status: false, isLoading: true },
    setAuthState: () => { },
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>(() => {
        const savedAuthState = localStorage.getItem("authState");
        return savedAuthState ? JSON.parse(savedAuthState) : { username: "", id: 0, status: false, isLoading: true };
    });

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            axios
                .get("http://localhost:3001/auth/validateToken", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    if (response.data.status) {
                        setAuthState({
                            username: response.data.username,
                            id: response.data.id,
                            status: true,
                            isLoading: false,
                        });
                    } else {
                        setAuthState({ username: "", id: 0, status: false, isLoading: false });
                    }
                })
                .catch(() => {
                    setAuthState({ username: "", id: 0, status: false, isLoading: false });
                });
        } else {
            setAuthState({ username: "", id: 0, status: false, isLoading: false });
        }
    }, []);

    useEffect(() => {
        if (!authState.isLoading) {
            localStorage.setItem("authState", JSON.stringify(authState));
        }
    }, [authState]);

    return (
        <AuthContext.Provider value={{ authState, setAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};