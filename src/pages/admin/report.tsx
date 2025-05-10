import { useEffect, useState } from 'react';
import api from '../../services/api';

interface Transaction {
  id: number;
  cpf: string;
  description: string;
  transactionDate: string;
  points: number;
  amount: number;
  status: string;
}

export default function ReportPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cpf, setCpf] = useState('');
  const [product, setProduct] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get<Transaction[]>('/admin/report', {
          params: {
            cpf: cpf || undefined,
            product: product || undefined,
            status: status || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            minAmount: minAmount || undefined,
            maxAmount: maxAmount || undefined,
          },
        });
        setTransactions(response.data);
      } catch (err) {
        console.error('Erro ao buscar relatório', err);
      }
    };

    fetchReport();
  }, [cpf, product, status, startDate, endDate, minAmount, maxAmount]);

  function fetchReport(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Relatório de Transações</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Produto"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Status</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Reprovado">Reprovado</option>
          <option value="Em avaliação">Em avaliação</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Valor mín."
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Valor máx."
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={fetchReport}
        className="mb-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Filtrar
      </button>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">CPF</th>
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
              <td className="p-2 border">{t.cpf}</td>
              <td className="p-2 border">{t.description}</td>
              <td className="p-2 border">{new Date(t.transactionDate).toLocaleDateString()}</td>
              <td className="p-2 border">{t.points}</td>
              <td className="p-2 border">R$ {Number(t.amount || 0).toFixed(2)}</td>
              <td className="p-2 border">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}