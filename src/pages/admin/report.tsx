import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import AdminHeader from '../../components/AdminHeader';

interface Transaction {
  id: number;
  cpf: string;
  description: string;
  transactionDate: string;
  points: number;
  amount: number;
  status: string;
}

function ReportPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cpf, setCpf] = useState('');
  const [product, setProduct] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusOptions = ["Aprovado", "Reprovado", "Em avaliação"];
  const statusDropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function statusColor(status: string) {
    if (status === "Aprovado") return "bg-green-100 text-green-800";
    if (status === "Reprovado") return "bg-red-100 text-red-800";
    if (status === "Em avaliação") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  }

  return (
    <AdminLayout>
      <AdminHeader title="Relatório de Transações" />
      <section className="bg-white py-8 md:py-16 min-h-screen">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <div className="gap-4 sm:flex sm:items-center sm:justify-between">
              <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                <div>
                  <label htmlFor="status-filter" className="sr-only mb-2 block text-sm font-medium text-gray-900">Status</label>
                  <div className="relative" ref={statusDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowStatusDropdown((v) => !v)}
                      className="flex items-center justify-between w-full min-w-[8rem] rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      {status ? status : "Todos status"}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showStatusDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow">
                        <ul>
                          <li>
                            <button
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${status === "" ? "font-bold" : ""}`}
                              onClick={() => { setStatus(""); setShowStatusDropdown(false); }}
                            >
                              Todos
                            </button>
                          </li>
                          {statusOptions.map((opt) => (
                            <li key={opt}>
                              <button
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${status === opt ? "font-bold" : ""}`}
                                onClick={() => { setStatus(opt); setShowStatusDropdown(false); }}
                              >
                                {opt}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <span className="inline-block text-gray-500">de</span>
                <div>
                  <label htmlFor="start-date" className="sr-only mb-2 block text-sm font-medium text-gray-900">Data inicial</label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <span className="inline-block text-gray-500">até</span>
                <div>
                  <label htmlFor="end-date" className="sr-only mb-2 block text-sm font-medium text-gray-900">Data final</label>
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label htmlFor="cpf" className="sr-only mb-2 block text-sm font-medium text-gray-900">CPF</label>
                  <input
                    id="cpf"
                    type="text"
                    placeholder="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label htmlFor="product" className="sr-only mb-2 block text-sm font-medium text-gray-900">Produto</label>
                  <input
                    id="product"
                    type="text"
                    placeholder="Produto"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label htmlFor="minAmount" className="sr-only mb-2 block text-sm font-medium text-gray-900">Valor mín.</label>
                  <input
                    id="minAmount"
                    type="number"
                    placeholder="Valor mín."
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label htmlFor="maxAmount" className="sr-only mb-2 block text-sm font-medium text-gray-900">Valor máx.</label>
                  <input
                    id="maxAmount"
                    type="number"
                    placeholder="Valor máx."
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchReport}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Filtrar
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flow-root sm:mt-8">
            <div className="divide-y divide-gray-200">
              {transactions.length === 0 && (
                <div className="py-8 text-center text-gray-400">Nenhuma transação encontrada.</div>
              )}
              {transactions.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center gap-y-4 py-6">
                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium text-gray-500">CPF:</dt>
                    <dd className="mt-1.5 text-base font-semibold text-gray-900">{t.cpf}</dd>
                  </dl>
                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium text-gray-500">Descrição:</dt>
                    <dd className="mt-1.5 text-base font-semibold text-gray-900">{t.description}</dd>
                  </dl>
                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium text-gray-500">Data:</dt>
                    <dd className="mt-1.5 text-base font-semibold text-gray-900">{new Date(t.transactionDate).toLocaleDateString()}</dd>
                  </dl>
                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium text-gray-500">Pontos:</dt>
                    <dd className="mt-1.5 text-base font-semibold text-gray-900">{t.points}</dd>
                  </dl>
                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium text-gray-500">Valor:</dt>
                    <dd className="mt-1.5 text-base font-semibold text-gray-900">R$ {Number(t.amount || 0).toFixed(2)}</dd>
                  </dl>
                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium text-gray-500">Status:</dt>
                    <dd className={`me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${statusColor(t.status)}`}>
                      {t.status}
                    </dd>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default ReportPage;