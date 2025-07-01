"use client";
import React, { useState, useEffect } from "react";
import checkToken from "../components/utils/testToken";
import SubmitButton from "../modules/SubmitButton";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Rediriger si déjà connecté (token valide)
  useEffect(() => {
    const checkLogin = async () => {
        const isValid = await checkToken()
          if (isValid) {
            console.log("Token is valid, redirecting to home page.");
            window.location.href = "/"; // redirection après login
          }
    }
    checkLogin();  
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

      if (await checkToken()) {
        console.log("Token is valid, redirecting to home page.");
        window.location.href = "/"; // redirection après login
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
        <button onClick={(e) => {
            handleSubmit(e);
          }}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
