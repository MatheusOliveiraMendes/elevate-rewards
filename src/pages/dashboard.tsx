import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import withAuth from '../components/withAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocale } from '../context/LocaleContext';

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
  const { t } = useLocale();


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

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        acc.totalPoints += transaction.points;
        acc.totalValue += transaction.amount;

        if (transaction.status === 'Aprovado') {
          acc.approvedPoints += transaction.points;
        } else if (transaction.status === 'Em avaliação') {
          acc.pendingPoints += transaction.points;
        } else if (transaction.status === 'Reprovado') {
          acc.rejectedPoints += transaction.points;
        }

        return acc;
      },
      {
        totalPoints: 0,
        approvedPoints: 0,
        pendingPoints: 0,
        rejectedPoints: 0,
        totalValue: 0,
      }
    );
  }, [transactions]);

  const statusClass = (status: string) => {
    if (status === 'Aprovado') {
      return 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30';
    }
    if (status === 'Reprovado') {
      return 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30';
    }
    if (status === 'Em avaliação') {
      return 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30';
    }
    return 'bg-white/10 text-slate-200 ring-1 ring-white/20';
  };

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30';

  const statusOptions = useMemo(
    () => [
      { value: '', label: t('status.all') },
      { value: 'Aprovado', label: t('status.approved') },
      { value: 'Reprovado', label: t('status.rejected') },
      { value: 'Em avaliação', label: t('status.pending') },
    ],
    [t],
  );

  return (
    <>
      <Header />
      <main className="relative isolate">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 pb-24">
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent px-8 py-10 shadow-[0_20px_45px_-20px_rgba(14,165,233,0.45)]">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
              {t('dashboard.hero.badge')}
            </p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {t('dashboard.hero.title')}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-200">
              {t('dashboard.hero.subtitle')}
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="glass-card p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                {t('dashboard.metrics.total')}
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {totals.totalPoints.toLocaleString('pt-BR')}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {t('dashboard.metrics.total.desc')}
              </p>
            </article>
            <article className="glass-card p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                {t('dashboard.metrics.approved')}
              </p>
              <p className="mt-3 text-4xl font-semibold text-emerald-300">
                {totals.approvedPoints.toLocaleString('pt-BR')}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {t('dashboard.metrics.approved.desc')}
              </p>
            </article>
            <article className="glass-card p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                {t('dashboard.metrics.pending')}
              </p>
              <p className="mt-3 text-4xl font-semibold text-amber-200">
                {totals.pendingPoints.toLocaleString('pt-BR')}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {t('dashboard.metrics.pending.desc')}
              </p>
            </article>
            <article className="glass-card p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                {t('dashboard.metrics.amount')}
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {totals.totalValue.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {t('dashboard.metrics.amount.desc')}
              </p>
            </article>
          </section>

          <section className="glass-card px-8 py-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {t('dashboard.filters.title')}
                </h2>
                <p className="text-sm text-slate-300">
                  {t('dashboard.filters.subtitle')}
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-slate-400">
                  {t('dashboard.filters.status')}
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`${inputClass} appearance-none pr-12`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value || 'all'} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8l4 4 4-4" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-slate-400">
                  {t('dashboard.filters.startDate')}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-slate-400">
                  {t('dashboard.filters.endDate')}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="w-full rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/10"
                >
                  {t('dashboard.filters.reset')}
                </button>
              </div>
            </div>
          </section>

          <section className="glass-card overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-white/10 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {t('dashboard.table.title')}
                </h2>
                <p className="text-sm text-slate-300">
                  {t('dashboard.table.subtitle')}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/5 text-xs font-semibold uppercase tracking-widest text-slate-300">
                  <tr>
                    <th className="px-8 py-4">{t('dashboard.table.description')}</th>
                    <th className="px-4 py-4">{t('dashboard.table.date')}</th>
                    <th className="px-4 py-4 text-right">{t('dashboard.table.points')}</th>
                    <th className="px-4 py-4 text-right">{t('dashboard.table.amount')}</th>
                    <th className="px-4 py-4 text-right">{t('dashboard.table.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-100">
                  {transactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-8 py-12 text-center text-sm text-slate-300"
                      >
                        {t('dashboard.table.empty')}
                      </td>
                    </tr>
                  )}
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="transition hover:bg-white/5"
                    >
                      <td className="px-8 py-4 font-medium">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold">
                        {transaction.points.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-200">
                        {transaction.amount.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
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
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default withAuth(DashboardPage);
