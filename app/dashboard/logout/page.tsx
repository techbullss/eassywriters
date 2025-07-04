"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("/api/logout", {
          method: "POST",
          credentials: "include", // 🔥 this sends the cookie
          cache: "no-store",
        });

        window.location.href = "/Loging"; // 🔁 full reload
      } catch (err) {
        console.error("Logout failed", err);
      }
    };

    logout();
  }, []);

  return <p>Logging out...</p>;
}
