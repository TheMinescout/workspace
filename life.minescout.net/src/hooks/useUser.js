import { useState } from "react";
// Added updateUserPassword to the imports
import { loginUser, registerUser, updateUserPassword } from "../data/posts";

const SESSION_KEY = "ms_user";

export function useUser() {
  const [user, setUser] = useState(() => {
    try {
      const s = sessionStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const login = async (username, password) => {
    const res = await loginUser(username, password);
    if (res.ok) {
      const u = { username: res.username };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
      setUser(u);
    }
    return res;
  };

  const register = async (username, password) => {
    const res = await registerUser(username, password);
    if (res.ok) {
      const u = { username: res.username };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
      setUser(u);
    }
    return res;
  };

  // NEW: The reset password function
  const resetPassword = async (username, newPassword) => {
    const res = await updateUserPassword(username, newPassword);
    return res;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  // NEW: Added resetPassword to the return statement here!
  return { user, login, register, logout, resetPassword };
}