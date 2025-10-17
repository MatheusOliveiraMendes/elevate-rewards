import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '../services/api';
import { useLocale } from '../context/LocaleContext';

interface LoginResponse {
  token: string;
}

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useLocale();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      router.push('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.login.error'));
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-20%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[26rem] w-[26rem] rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-12 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_20px_60px_-20px_rgba(56,189,248,0.35)] backdrop-blur-2xl lg:grid-cols-[1.2fr_1fr]">
        <section className="flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-lg font-bold text-sky-200 ring-1 ring-sky-500/30">
              ER
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                {t('header.brand.tagline')}
              </p>
              <h1 className="text-3xl font-semibold text-white">
                {t('auth.login.hero.title')}
              </h1>
            </div>
          </div>
          <p className="mt-8 text-lg text-slate-100 lg:max-w-xl">
            {t('auth.login.hero.subtitle')}
          </p>
          <ul className="mt-10 space-y-5 text-sm text-slate-200">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-400/40">
                ✓
              </span>
              {t('auth.login.hero.item1')}
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-400/20 text-sky-200 ring-1 ring-sky-400/40">
                ✓
              </span>
              {t('auth.login.hero.item2')}
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-400/20 text-violet-200 ring-1 ring-violet-400/40">
                ✓
              </span>
              {t('auth.login.hero.item3')}
            </li>
          </ul>
        </section>

        <section className="glass-card p-8">
          <h2 className="text-2xl font-semibold text-white">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {t('auth.login.subtitle')}
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-2xl border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {t('auth.login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="youemail@elevaterewards.com"
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                <label>{t('auth.login.password')}</label>
                <Link href="#" className="text-sky-300 hover:text-sky-200">
                  {t('auth.login.forgot')}
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder={t('auth.login.password')}
                required
              />
            </div>

            <button type="submit" className="primary-button w-full py-3 text-base">
              {t('auth.login.submit')}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm text-slate-200">
            <p>{t('auth.login.ctaLabel')}</p>
            <Link
              href="/register"
              className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"
            >
              {t('auth.login.ctaLink')}
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
