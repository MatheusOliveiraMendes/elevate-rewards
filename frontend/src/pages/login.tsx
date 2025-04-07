import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import './globals.css';

interface LoginResponse {
  token: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

   
    try {
      const response = await axios.post<LoginResponse>('http://localhost:3001/api/auth/login', {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      router.push('/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/register"); // Redirects to the registration page.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <form onSubmit={handleLogin} className="bg-white text-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-extrabold mb-6 text-center">Bem-vindo de volta!</h2>
          <p className="text-center text-gray-600 mb-6">
          Faça login para acessar o dashboard.
        </p>

        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-full mb-4 rounded-lg"
          required
        />

        <label className="block mb-2 text-sm font-medium">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 w-full mb-6 rounded-lg"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-3 w-full rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          Entrar
        </button>

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

      </form>
    </div>
  );
}
