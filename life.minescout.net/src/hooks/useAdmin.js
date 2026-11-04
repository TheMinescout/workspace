import { useState, useEffect } from "react";
import { adminLogin, adminLogout, fetchAdminSession } from "../data/posts";

export function useAdmin() {
  // null = still checking the server session
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchAdminSession()
      .then(res => { if (alive) setIsAdmin(!!res?.isAdmin); })
      .catch(() => { if (alive) setIsAdmin(false); });
    return () => { alive = false; };
  }, []);

  const login = async (password) => {
    const res = await adminLogin(password);
    if (res?.ok) {
      setIsAdmin(true);
      return true;
    }
    setIsAdmin(false);
    return false;
  };

  const logout = async () => {
    setIsAdmin(false);
    await adminLogout();
  };

  return { isAdmin, login, logout };
}
