import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import withAuth from '../components/withAuth';
import { useLocale } from '../context/LocaleContext';

interface WalletResponse {
  approvedPoints: number | string | null;
}

type TierKey = 'platinum' | 'gold' | 'silver' | 'bronze' | 'beginner';

function WalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useLocale();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await api.get<WalletResponse>('/wallet');
        const rawPoints = response.data?.approvedPoints ?? 0;
        const numericPoints = Number(rawPoints);

        if (!Number.isFinite(numericPoints)) {
          throw new Error('Invalid points value received from API.');
        }

        setBalance(numericPoints);
        setErrorMessage('');
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 404) {
          setBalance(0);
          setErrorMessage(t('wallet.error.empty'));
        } else {
          console.error('Erro ao buscar saldo da carteira', err);
          setBalance(0);
          setErrorMessage(t('wallet.error.generic'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [t]);

  const tierKey: TierKey = useMemo(() => {
    if (balance >= 15000) return 'platinum';
    if (balance >= 8000) return 'gold';
    if (balance >= 3500) return 'silver';
    if (balance > 0) return 'bronze';
    return 'beginner';
  }, [balance]);

  const nextTierInfo = useMemo(() => {
    if (balance >= 15000) return null;
    if (balance >= 8000) return { key: 'platinum' as TierKey, threshold: 15000 };
    if (balance >= 3500) return { key: 'gold' as TierKey, threshold: 8000 };
    if (balance > 0) return { key: 'silver' as TierKey, threshold: 3500 };
    return { key: 'bronze' as TierKey, threshold: 1000 };
  }, [balance]);

  const lowerBound = useMemo(() => {
    switch (tierKey) {
      case 'platinum':
        return 15000;
      case 'gold':
        return 8000;
      case 'silver':
        return 3500;
      case 'bronze':
        return 1000;
      default:
        return 0;
    }
  }, [tierKey]);

  const progress = useMemo(() => {
    if (!nextTierInfo) return 100;
    if (balance <= 0) return 0;

    return Math.min(
      100,
      Math.round(((balance - lowerBound) / (nextTierInfo.threshold - lowerBound)) * 100),
    );
  }, [balance, lowerBound, nextTierInfo]);

  const pointsToNextTier = useMemo(() => {
    if (!nextTierInfo) return 0;
    return Math.max(nextTierInfo.threshold - balance, 0);
  }, [balance, nextTierInfo]);

  const tierLabel = t(`wallet.tier.${tierKey}` as const);
  const nextTierLabel = nextTierInfo ? t(`wallet.tier.${nextTierInfo.key}` as const) : null;

  return (
    <>
      <Header />
      <main className="relative isolate">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12 pb-24">
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 via-transparent to-sky-500/10 px-8 py-10 shadow-[0_25px_60px_-25px_rgba(74,222,128,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              {t('wallet.hero.badge')}
            </p>
            <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white">{t('wallet.hero.title')}</h1>
                <p className="mt-4 max-w-xl text-base text-slate-200">
                  {t('wallet.hero.subtitle')}
                </p>
              </div>
              <div className="glass-card flex flex-col items-center gap-2 px-8 py-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {t('wallet.hero.balance')}
                </span>
                {loading ? (
                  <span className="text-sm text-slate-300">{t('wallet.loading')}</span>
                ) : (
                  <>
                    <span className="text-4xl font-semibold text-white">
                      {balance.toLocaleString('pt-BR')} pts
                    </span>
                    <span className="text-sm text-slate-300">
                      {t('wallet.hero.caption')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </section>

          <section className="glass-card overflow-hidden">
            <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="text-xl font-semibold text-white">{t('wallet.metrics.title')}</h2>
                <p className="mt-2 text-sm text-slate-300">
                  {t('wallet.metrics.subtitle')}{' '}
                  <span className="text-emerald-300">{tierLabel}</span>.{' '}
                  {t('wallet.metrics.subtitleSuffix')}
                </p>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    <span>{t('wallet.metrics.progress')}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {nextTierInfo ? (
                    <p className="mt-4 text-sm text-slate-300">
                      {t('wallet.metrics.remainingPrefix')}{' '}
                      <span className="font-semibold text-white">
                        {pointsToNextTier.toLocaleString('pt-BR')}
                      </span>{' '}
                      {t('wallet.metrics.next')}{' '}
                      <span className="text-emerald-300">{nextTierLabel}</span>.
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-emerald-200">{t('wallet.metrics.target')}</p>
                  )}
                </div>
                {errorMessage && (
                  <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/15 px-4 py-3 text-sm text-rose-200">
                    {errorMessage}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {t('wallet.side.nextSteps')}
                  </p>
                  <p className="mt-3 text-sm text-slate-200">
                    {t('wallet.side.nextSteps.desc')}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {t('wallet.side.control')}
                  </p>
                  <p className="mt-3 text-sm text-slate-200">
                    {t('wallet.side.control.desc')}
                  </p>
                  <Link
                    href="/dashboard"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"
                  >
                    {t('wallet.side.link')}
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 10h10" />
                      <path d="M10 5l5 5-5 5" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default withAuth(WalletPage);
