"use client";
import React, { useState, useEffect } from "react";
import checkToken from "../components/utils/testToken";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  // Redirection si connecté
  useEffect(() => {
    const checkLogin = async () => {
      const isValid = await checkToken();
      if (isValid) {
        window.location.href = "/";
      }
    };
    checkLogin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          fullname,
          email,
          password,
          role,
        }),
      });

      const res = await response.json();

      if (!response.ok || !res.token) {
        alert(res.message || "Registration failed. Please try again.");
        return;
      }

      localStorage.setItem("token", res.token);
      console.log("Registration successful, token stored:", res.token);

      window.location.href = "/";
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-black">Register</h2>

        <div>
          <label className="block text-sm font-medium text-black">Username</label>
          <input
            type="text"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johnDoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Full name</label>
          <input
            type="text"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded text-black"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Email</label>
          <input
            type="email"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
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

        <div>
          <label className="block text-sm font-medium text-black">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded text-black"
          >
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition duration-200"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Register;
