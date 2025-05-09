import { useEffect, useState } from 'react';
import api from '../services/api';

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0);

  const fetchWallet = async () => {
    try {
      interface WalletResponse {
        approvedPoints: number;
      }

      const response = await api.get<WalletResponse>('/wallet');
      setBalance(response.data.approvedPoints);
    } catch (err) {
      console.error('Erro ao buscar saldo da carteira', err);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Minha Carteira</h1>
        <p className="text-lg text-gray-700">Saldo em pontos aprovados:</p>
        <p className="text-4xl font-bold text-green-600 mt-2">{balance.toLocaleString()} pts</p>
      </div>
    </div>
  );
}