import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import AdminHeader from '../../components/AdminHeader';
import { useLocale } from '../../context/LocaleContext';

interface Transaction {
  id: number;
  cpf: string;
  description: string;
  transactionDate: string;
  points: number;
  amount: number;
  status: string;
}

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30';

const rawStatusOptions = [
  { value: 'Aprovado', key: 'status.approved' },
  { value: 'Reprovado', key: 'status.rejected' },
  { value: 'Em avaliação', key: 'status.pending' },
];

function ReportPage() {
  const { t } = useLocale();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cpf, setCpf] = useState('');
  const [product, setProduct] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = useMemo(
    () => rawStatusOptions.map((option) => ({ ...option, label: t(option.key) })),
    [t],
  );

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
      console.error('Error fetching admin report', err);
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusClass = (value: string) => {
    if (value === 'Aprovado') {
      return 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30';
    }
    if (value === 'Reprovado') {
      return 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30';
    }
    if (value === 'Em avaliação') {
      return 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30';
    }
    return 'bg-white/10 text-slate-200 ring-1 ring-white/20';
  };

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        acc.total += 1;
        acc.points += transaction.points;
        acc.amount += transaction.amount;
        return acc;
      },
      { total: 0, points: 0, amount: 0 },
    );
  }, [transactions]);

  const summaryText = useMemo(() => {
    return t('admin.report.results.summary')
      .replace('{total}', totals.total.toString())
      .replace('{points}', totals.points.toLocaleString('en-US'))
      .replace(
        '{amount}',
        totals.amount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
      );
  }, [t, totals]);

  return (
    <AdminLayout>
      <AdminHeader />

      <section className="grid gap-8">
        <div className="glass-card px-8 py-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">{t('admin.report.filters.title')}</h2>
              <p className="text-sm text-slate-300">
                {t('admin.report.filters.subtitle')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setCpf('');
                  setProduct('');
                  setStatus('');
                  setStartDate('');
                  setEndDate('');
                  setMinAmount('');
                  setMaxAmount('');
                  fetchReport();
                }}
                className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/10"
              >
                {t('admin.report.filters.clear')}
              </button>
              <button
                type="button"
                onClick={fetchReport}
                className="primary-button px-5 py-2.5 text-sm"
              >
                {t('admin.report.filters.apply')}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {t('admin.report.filters.status')}
              </label>
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                >
                  {status ? statusOptions.find((opt) => opt.value === status)?.label : t('status.all')}
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 7l5 5 5-5" />
                  </svg>
                </button>
                {showStatusDropdown && (
                  <div className="absolute z-10 mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/95 p-1 text-sm text-white shadow-xl backdrop-blur">
                    <button
                      type="button"
                      className={`w-full rounded-xl px-4 py-2 text-left transition hover:bg-white/10 ${
                        status === '' ? 'bg-white/10 font-semibold' : ''
                      }`}
                      onClick={() => {
                        setStatus('');
                        setShowStatusDropdown(false);
                      }}
                    >
                      {t('status.all')}
                    </button>
                    {statusOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={`w-full rounded-xl px-4 py-2 text-left transition hover:bg-white/10 ${
                          status === option.value ? 'bg-white/10 font-semibold' : ''
                        }`}
                        onClick={() => {
                          setStatus(option.value);
                          setShowStatusDropdown(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {t('admin.report.filters.startDate')}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {t('admin.report.filters.endDate')}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {t('admin.report.filters.cpf')}
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {t('admin.report.filters.product')}
              </label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {t('admin.report.filters.minAmount')}
              </label>
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {t('admin.report.filters.maxAmount')}
              </label>
              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="glass-card px-8 py-6">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {t('admin.report.results.title')}
              </h2>
              <p className="text-sm text-slate-300">{summaryText}</p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-100">
              <thead className="bg-white/5 text-xs font-semibold uppercase tracking-widest text-slate-300">
                <tr>
                  <th className="px-6 py-4">{t('admin.report.column.cpf')}</th>
                  <th className="px-6 py-4">{t('admin.report.column.description')}</th>
                  <th className="px-4 py-4">{t('admin.report.column.date')}</th>
                  <th className="px-4 py-4 text-right">{t('admin.report.column.points')}</th>
                  <th className="px-4 py-4 text-right">{t('admin.report.column.amount')}</th>
                  <th className="px-4 py-4 text-right">{t('admin.report.column.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-slate-300"
                    >
                      {t('admin.report.results.empty')}
                    </td>
                  </tr>
                )}
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="transition hover:bg-white/5">
                    <td className="px-6 py-4 font-medium tracking-wide">
                      {transaction.cpf}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-200">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold">
                      {transaction.points.toLocaleString('en-US')}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-200">
                      {transaction.amount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`float-right inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default ReportPage;
