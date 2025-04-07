import { useEffect, useState } from 'react';
import withAuth from '../components/withAuth';
import axios from 'axios';
import { useRouter } from 'next/router';
import './globals.css';

interface Transaction {
  id: number;
  description: string;
  transactionDate: string;
  points: number;
  amount: number;
  status: string;
}

function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Transaction[]>('http://localhost:3001/api/transactions/user', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            status: statusFilter || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          },
        });
        setTransactions(response.data);
      } catch (err) {
        console.error('Erro ao buscar transações:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [statusFilter, startDate, endDate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Extrato de Transações</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow-md mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto"
          >
            <option value="">Todos</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Reprovado">Reprovado</option>
            <option value="Em avaliação">Em avaliação</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-6">Carregando transações...</div>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Descrição</th>
              <th className="p-2 border">Data</th>
              <th className="p-2 border">Pontos</th>
              <th className="p-2 border">Valor</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t, index) => (
                <tr
                  key={t.id}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="p-2 border">{t.description}</td>
                  <td className="p-2 border">
                    {new Date(t.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{t.points}</td>
                  <td className="p-2 border">R$ {t.amount.toFixed(2)}</td>
                  <td className="p-2 border">{t.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default withAuth(DashboardPage);