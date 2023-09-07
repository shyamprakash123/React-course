import { navigate } from "raviger";
import React, { useEffect, useState } from "react";
import { login } from "./utils/apiUtils";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="w-full max-w-lg divide-y divide-gray-200">
      <h1 className="text-2xl my-2 text-gray-700">Login</h1>
      <form className="py-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username">Username</label>
          <input
            className="w-full border-2 border-gary-200 rounded-lg p-2 my-2 flex-1"
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            className="w-full border-2 border-gary-200 rounded-lg p-2 my-2 flex-1"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <button
            className="w-full border-2 border-gary-200 rounded-lg p-2 my-2 flex-1"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
