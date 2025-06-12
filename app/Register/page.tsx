"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Registration failed.");
      } else {
        // Handle success e.g. redirect or auto login
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-2">
      <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-2xl max-w-sm w-full p-4">
        

        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center gap-3 w-full py-2.5 rounded-full  hover:bg-red-700 text-gray-700 font-semibold shadow-md transition duration-300 mb-6 transform hover:scale-105"
        >
          <img
            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
            alt="Google Logo"
            className="h-6 mr-2"
          />
          Sign up with Google
        </button>

        <p className="text-center text-gray-600 mb-5 font-medium tracking-wide text-sm">
          Or register with your email
        </p>

        {error && (
          <p className="mb-5 text-red-600 font-semibold text-center animate-pulse text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleEmailRegister} className="space-y-4">
          {[
            {
              label: "Full Name",
              type: "text",
              value: name,
              setValue: setName,
              placeholder: "John Doe",
            },
            {
              label: "Email Address",
              type: "email",
              value: email,
              setValue: setEmail,
              placeholder: "you@example.com",
            },
            {
              label: "Password",
              type: "password",
              value: password,
              setValue: setPassword,
              placeholder: "At least 6 characters",
            },
            {
              label: "Confirm Password",
              type: "password",
              value: confirmPassword,
              setValue: setConfirmPassword,
              placeholder: "Retype your password",
            },
          ].map(({ label, type, value, setValue, placeholder }) => (
            <div key={label} className="relative">
              <input
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder=" "
                className="peer block w-full rounded-lg border border-gray-300 px-3.5 pt-5 pb-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
                minLength={type === "password" ? 6 : undefined}
                autoComplete={type === "password" ? "new-password" : undefined}
              />
              <label
                className="absolute left-3.5 top-1.5 text-gray-500 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-indigo-600 peer-focus:text-xs select-none"
              >
                {label}
              </label>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold shadow-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 text-sm"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5 text-xs">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
