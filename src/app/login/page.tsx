"use client";
import React, { useState, useEffect } from "react";
import checkToken from "../components/utils/testToken";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Rediriger si déjà connecté (token valide)
  useEffect(() => {
    if (checkToken()) {
      window.location.href = "/"; // mets ici ta route protégée
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Failed to login. Please try again.");
        return;
      }

      const res = await response.json();

      if (!res || !res.token) {
        alert("Login failed. Please check your credentials.");
        return;
      }

      localStorage.setItem("token", res.token);
      console.log("Login successful, token stored:", res.token);

      if (checkToken()) {
        window.location.href = "/dashboard"; // redirection après login
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-black">Login</h2>

        <div>
          <label className="block text-sm font-medium text-black">Email</label>
          <input
            type="email"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Password</label>
          <input
            type="password"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
