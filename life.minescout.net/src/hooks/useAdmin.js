import { useState, useEffect } from "react";
import { siteConfig } from "../data/posts";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem("admin_authenticated") === "true"
  );

  const login = (password) => {
    if (password === siteConfig.adminPassword) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
}
