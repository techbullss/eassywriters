"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        // Step 1: Get the logged-in Google user
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();

        if (!session?.user?.email) {
          throw new Error("No Google session found");
        }

        // Step 2: Call Spring Boot to register/login user & get token
        const backendRes = await fetch("http://localhost:8080/api/auth/google-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: session.user.name,
            email: session.user.email,
          }),
        });

        const { token } = await backendRes.json();

        // Step 3: Save token via shared route (client → server)
        await fetch("/api/save-token", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        // Step 4: Redirect
        router.push("/dashboard");
      } catch (err) {
        console.error("Google login error:", err);
        router.push("/Loging");
      }
    };

    handleGoogleLogin();
  }, [router]);

  return <p className="text-gray-600">Finalizing Google sign-in...</p>;
}
