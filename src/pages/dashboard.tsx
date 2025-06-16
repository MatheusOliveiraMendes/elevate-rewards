import { useEffect, useState } from 'react';
import api from '../services/api'; 
import withAuth from '../components/withAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';

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


  useEffect(() => {
   

    const fetchTransactions = async () => {
      try {
        const response = await api.get<Transaction[]>('/transactions/user', {
          params: {
            status: statusFilter || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          },
        });
        setTransactions(response.data);
      } catch (err) {
        console.error('Erro ao buscar transações:', err);
      }
    };

    fetchTransactions();
  }, [statusFilter, startDate, endDate]);

  

  return (
    <>
     <Header />
    <div className="p-8"> 
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Extrato de Transações</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
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
          className="border px-3 py-2 rounded"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      <table className="w-full border">
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
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="p-2 border">{t.description}</td>
              <td className="p-2 border">{new Date(t.transactionDate).toLocaleDateString()}</td>
              <td className="p-2 border">{t.points}</td>
              <td className="p-2 border">R$ {t.amount.toFixed(2)}</td>
              <td className="p-2 border">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer />
    </>
  );
}

export default withAuth(DashboardPage);