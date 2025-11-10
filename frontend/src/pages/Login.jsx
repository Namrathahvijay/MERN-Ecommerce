import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ setToken, initial = "Sign Up" }) => {
  const [currentState, setCurrentState] = useState(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || "http://localhost:4000", []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const isLogin = currentState === "Login";
      const endpoint = isLogin ? "/api/user/login" : "/api/user/register";
      const body = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success || !data.token) {
        throw new Error(data.message || "Authentication failed");
      }
      setToken(data.token);
      toast.success(isLogin ? "Logged in" : "Account created");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    setCurrentState(initial);
  }, [initial]);

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl prata-regular">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="hello@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="flex justify-between w-full text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create a new account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login here
          </p>
        )}
      </div>
      <button className="px-8 py-2 mt-4 font-light text-white bg-black">{currentState === "Login" ? "Sign In" : "Sign Up"}</button>
    </form>
  );
};

export default Login;
