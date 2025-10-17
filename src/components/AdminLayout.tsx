import type { JSX } from 'react';
import { ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLocale } from '../context/LocaleContext';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  description: string;
  href: string;
  icon: JSX.Element;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLocale();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: t('admin.nav.overview'),
        description: t('admin.nav.overview.desc'),
        href: '/admin/dashboard',
        icon: (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3h7v7H3z" />
            <path d="M14 3h7v7h-7z" />
            <path d="M14 14h7v7h-7z" />
            <path d="M3 14h7v7H3z" />
          </svg>
        ),
      },
      {
        label: t('admin.nav.upload'),
        description: t('admin.nav.upload.desc'),
        href: '/admin/upload',
        icon: (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
            <path d="M5 19h14" />
          </svg>
        ),
      },
      {
        label: t('admin.nav.report'),
        description: t('admin.nav.report.desc'),
        href: '/admin/report',
        icon: (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3h18" />
            <path d="M9 3v18" />
            <path d="M9 8h12" />
            <path d="M9 13h12" />
            <path d="M9 18h12" />
          </svg>
        ),
      },
    ],
    [t],
  );

  const isActive = (href: string) =>
    router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex w-full">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950/95 px-6 py-8 backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/20 text-lg font-bold text-sky-200 ring-1 ring-sky-500/30">
                ER
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  {t('header.brand.tagline')}
                </p>
                <p className="text-lg font-semibold text-white">
                  {t('admin.console.title')}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group block rounded-2xl border border-transparent px-4 py-4 transition ${
                  isActive(item.href)
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${
                      isActive(item.href)
                        ? 'border-white/20 bg-white/10 text-white'
                        : 'border-white/10 bg-white/5 text-slate-200 group-hover:border-white/20 group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-5 text-xs text-slate-300">
            <p className="font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t('admin.sidebar.governance')}
            </p>
            <p className="mt-2">{t('admin.sidebar.governance.desc')}</p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-950/80 py-4 backdrop-blur md:hidden">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10"
              aria-label="Open menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            </button>
            <p className="text-sm font-semibold text-white">
              {t('admin.console.mobile')}
            </p>
            <span className="h-10 w-10" />
          </div>

          <main className="flex-1 px-6 py-10 md:px-8">{children}</main>
        </div>
      </div>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}
