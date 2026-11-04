import { useState, useEffect } from "react";
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from "../data/posts";

export function useUser() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchCurrentUser()
      .then(res => { if (alive && res?.ok) setUser({ username: res.username }); })
      .catch(() => {})
      .finally(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, []);

  const login = async (username, password) => {
    const res = await loginUser(username, password);
    if (res?.ok) setUser({ username: res.username });
    return res;
  };

  const register = async (username, password) => {
    const res = await registerUser(username, password);
    if (res?.ok) setUser({ username: res.username });
    return res;
  };

  const logout = async () => {
    setUser(null);
    await logoutUser();
  };

  return { user, ready, login, register, logout };
}
