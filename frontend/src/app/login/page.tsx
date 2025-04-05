"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState(""); // State for email input.
  const [password, setPassword] = useState(""); // State for password input.
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post("/login", { email, password }); // Sends login request.
      localStorage.setItem("token", data.token); // Stores token in localStorage.
      router.push("/dashboard"); // Redirects to dashboard on success.
    } catch {
      alert("Erro ao fazer login."); // Displays error message on failure.
    }
  }

  const handleRegisterRedirect = () => {
    router.push("/register"); // Redirects to the registration page.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      {/* Main container with centered content and gradient background. */}
      <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        {/* Login form container with white background and shadow. */}
        <h1 className="text-3xl font-extrabold mb-6 text-center">
          Bem-vindo de volta!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Faça login para acessar o dashboard.
        </p>
        <form onSubmit={handleLogin}>
          <input
            className="border p-3 w-full mb-4 rounded-lg"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="border p-3 w-full mb-6 rounded-lg"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 w-full rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Entrar
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">Ainda não tem uma conta?</p>
          <button
            type="button"
            onClick={handleRegisterRedirect}
            className="text-blue-500 hover:underline mt-2"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}