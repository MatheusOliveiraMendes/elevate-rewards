import { useRouter } from 'next/router';
import { useLocale } from '../context/LocaleContext';

interface AdminHeaderProps {
  onLogout?: () => void;
  title?: string;
  description?: string;
}

export default function AdminHeader({
  onLogout,
  title,
  description,
}: AdminHeaderProps) {
  const router = useRouter();
  const { t } = useLocale();

  const resolvedTitle = title ?? t('admin.header.defaultTitle');
  const resolvedDescription = description ?? t('admin.header.description');

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
    if (onLogout) onLogout();
  };

  return (
    <header className="mb-10">
      <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 px-8 py-6 shadow-[0_20px_45px_-25px_rgba(56,189,248,0.35)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
            {t('admin.header.section')}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            {resolvedTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">{resolvedDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="secondary-button"
          >
            {t('admin.header.back')}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="primary-button"
          >
            {t('admin.header.logout')}
          </button>
        </div>
      </div>
    </header>
  );
}
