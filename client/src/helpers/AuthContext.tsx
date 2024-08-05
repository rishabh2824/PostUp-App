import { createContext, Dispatch, SetStateAction } from "react";

interface AuthState {
  username: string;
  id: number;
  status: boolean;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: Dispatch<SetStateAction<AuthState>>;
}

// Provide default values
export const AuthContext = createContext<AuthContextType>({
  authState: { username: "", id: 0, status: false },
  setAuthState: () => {}, // Empty function for default value
});

