import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '../services/api';
import { useLocale } from '../context/LocaleContext';

interface RegisterResponse {
  token: string;
}

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post<RegisterResponse>('/auth/register', {
        name,
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      router.push('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.register.error'));
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-15%] top-[-15%] h-[28rem] w-[28rem] rotate-12 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[34rem] w-[34rem] rounded-full bg-sky-500/15 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-12 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_20px_60px_-20px_rgba(74,222,128,0.3)] backdrop-blur-2xl lg:grid-cols-[1fr_1.1fr]">
        <section className="glass-card border-white/5 bg-white/10 p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
            {t('auth.register.hero.badge')}
          </p>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            {t('auth.register.hero.title')}
          </h1>
          <p className="mt-5 text-base text-slate-200">
            {t('auth.register.hero.subtitle')}
          </p>

          <div className="mt-10 grid gap-6 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t('auth.register.hero.card1').toUpperCase()}
              </p>
              <p className="mt-2">
                {t('auth.register.hero.card1.desc')}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t('auth.register.hero.card2').toUpperCase()}
              </p>
              <p className="mt-2">
                {t('auth.register.hero.card2.desc')}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t('auth.register.hero.card3').toUpperCase()}
              </p>
              <p className="mt-2">
                {t('auth.register.hero.card3.desc')}
              </p>
            </div>
          </div>
        </section>

        <section className="glass-card p-8">
          <h2 className="text-2xl font-semibold text-white">
            {t('auth.register.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {t('auth.register.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-2xl border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {t('auth.register.name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder={t('auth.register.name')}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {t('auth.register.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@elevaterewards.cloud"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {t('auth.register.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder={t('auth.register.password')}
                required
              />
              <p className="mt-2 text-xs text-slate-400">
                {t('auth.register.passwordHint')}
              </p>
            </div>

            <button
              type="submit"
              className="primary-button w-full bg-emerald-500 hover:bg-emerald-400 focus-visible:outline-emerald-200"
            >
              {t('auth.register.submit')}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm text-slate-200">
            <p>{t('auth.register.ctaLabel')}</p>
            <Link
              href="/login"
              className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
            >
              {t('auth.register.ctaLink')}
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
        </section>
      </div>
    </main>
  );
}
