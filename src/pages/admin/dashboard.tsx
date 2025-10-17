import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import withAuth from '../../components/withAuth';
import AdminLayout from '../../components/AdminLayout';
import AdminHeader from '../../components/AdminHeader';
import { useLocale } from '../../context/LocaleContext';

interface JwtPayload {
  id: string;
  role: 'admin' | 'user';
}

interface SummaryCard {
  title: string;
  description: string;
  value: string;
  href: string;
  tone: 'sky' | 'emerald' | 'amber' | 'violet';
}

interface QuickCard {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  icon: string;
}

const toneStyles: Record<SummaryCard['tone'], string> = {
  sky: 'border-sky-400/40 bg-sky-500/10 text-sky-100',
  amber: 'border-amber-400/40 bg-amber-500/10 text-amber-100',
  violet: 'border-violet-400/40 bg-violet-500/10 text-violet-100',
  emerald: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100',
};

function AdminDashboard() {
  const router = useRouter();
  const { t } = useLocale();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      setIsAdmin(decoded.role === 'admin');
    }
  }, []);

  const summaryCards: SummaryCard[] = useMemo(
    () => [
      {
        title: t('admin.summary.uploads'),
        description: t('admin.summary.uploads.desc'),
        value: t('admin.summary.uploads.value'),
        href: '/admin/upload',
        tone: 'sky',
      },
      {
        title: t('admin.summary.evaluation'),
        description: t('admin.summary.evaluation.desc'),
        value: t('admin.summary.evaluation.value'),
        href: '/admin/report?status=Em%20avalia%C3%A7%C3%A3o',
        tone: 'amber',
      },
      {
        title: t('admin.summary.alerts'),
        description: t('admin.summary.alerts.desc'),
        value: t('admin.summary.alerts.value'),
        href: '/admin/report?status=Reprovado',
        tone: 'violet',
      },
      {
        title: t('admin.summary.sla'),
        description: t('admin.summary.sla.desc'),
        value: t('admin.summary.sla.value'),
        href: '/admin/report',
        tone: 'emerald',
      },
    ],
    [t],
  );

  const quickCards: QuickCard[] = useMemo(
    () => [
      {
        title: t('admin.quick.upload.title'),
        description: t('admin.quick.upload.desc'),
        actionLabel: t('admin.quick.upload.action'),
        href: '/admin/upload',
        icon: '📤',
      },
      {
        title: t('admin.quick.report.title'),
        description: t('admin.quick.report.desc'),
        actionLabel: t('admin.quick.report.action'),
        href: '/admin/report',
        icon: '📊',
      },
    ],
    [t],
  );

  if (!isAdmin) return null;

  return (
    <AdminLayout>
      <AdminHeader />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={() => router.push(card.href)}
            className={`group flex flex-col items-start rounded-3xl border px-6 py-6 text-left transition hover:border-white/25 hover:bg-white/10 ${toneStyles[card.tone]}`}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              {card.title}
            </span>
            <span className="mt-3 text-2xl font-semibold text-white">{card.value}</span>
            <span className="mt-2 text-xs text-white/75">{card.description}</span>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white/80 transition group-hover:text-white">
              {t('admin.summary.link')}
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 10h10" />
                <path d="M10 5l5 5-5 5" />
              </svg>
            </span>
          </button>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {quickCards.map((card) => (
            <article
              key={card.href}
              className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-white/20 hover:bg-white/10"
            >
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                  {card.icon}
                </span>
                <h2 className="mt-5 text-xl font-semibold text-white">{card.title}</h2>
                <p className="mt-3 text-sm text-slate-300">{card.description}</p>
              </div>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition group-hover:text-sky-200"
                onClick={() => router.push(card.href)}
              >
                {card.actionLabel}
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
              </button>
            </article>
          ))}
        </div>

        <aside className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t('admin.sidebar.governance')}
            </p>
            <h3 className="mt-3 text-lg font-semibold text-white">
              {t('admin.sidebar.governance.desc')}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>{t('admin.sidebar.governance.item1')}</li>
              <li>{t('admin.sidebar.governance.item2')}</li>
              <li>{t('admin.sidebar.governance.item3')}</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t('admin.sidebar.operations')}
            </p>
            <h3 className="mt-3 text-lg font-semibold text-white">
              {t('admin.sidebar.operations.desc')}
            </h3>
            <p className="mt-4 text-sm text-slate-300">
              {t('admin.sidebar.operations.body')}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t('admin.sidebar.security')}
            </p>
            <h3 className="mt-3 text-lg font-semibold text-white">
              {t('admin.sidebar.security.desc')}
            </h3>
            <p className="mt-4 text-sm text-slate-300">
              {t('admin.sidebar.security.body')}
            </p>
          </div>
        </aside>
      </section>
    </AdminLayout>
  );
}

export default withAuth(AdminDashboard);
