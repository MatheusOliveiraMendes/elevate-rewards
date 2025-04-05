"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";

export default function Register() {
  const [name, setName] = useState(""); // State for name input.
  const [email, setEmail] = useState(""); // State for email input.
  const [password, setPassword] = useState(""); // State for password input.
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post("/register", { name, email, password }); // Sends registration request.
      localStorage.setItem("token", data.token); // Stores token in localStorage.
      router.push("/dashboard"); // Redirects to dashboard on success.
    } catch {
      alert("Erro ao fazer registro."); // Displays error message on failure.
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      {/* Main container with centered content and gradient background. */}
      <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        {/* Registration form container with white background and shadow. */}
        <h1 className="text-3xl font-extrabold mb-6 text-center">
          Crie sua conta
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Preencha os campos abaixo para se registrar e acessar o dashboard.
        </p>
        <form onSubmit={handleRegister}>
          <input
            className="border p-3 w-full mb-4 rounded-lg"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)} 
          />
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
            Registrar
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">Já tem uma conta?</p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline mt-2"
          >
            Fazer login
          </button>
        </div>
      </div>
    </div>
  );
}