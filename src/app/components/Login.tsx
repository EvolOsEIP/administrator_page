import React, { useState } from "react";

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((response) => {
      if (!response.ok) {
        alert('Failed to login. Please try again.', response.statusText);
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
    ).catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
    if (!res || !res.token) {
      alert('Login failed. Please check your credentials.');
      return;
    }
    localStorage.setItem('token', res.token); // Store token in local storage
    console.log("Login successful, token stored:", res.token);
    // setIsLoggedIn(true); // Set logged-in state to true
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
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
