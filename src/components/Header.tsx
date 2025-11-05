import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLocale } from "../context/LocaleContext";
import { clearSession, getActiveSession } from "../services/authStorage";

interface NavLink {
  href: string;
  label: string;
}

const Header: React.FC = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);
  const [errorKey, setErrorKey] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageSelectorRef = useRef<HTMLDivElement | null>(null);
  const { t, locale, setLocale } = useLocale();

  const navLinks: NavLink[] = useMemo(
    () => [
      { href: "/dashboard", label: t("header.nav.dashboard") },
      { href: "/wallet", label: t("header.nav.wallet") },
    ],
    [t],
  );

  useEffect(() => {
    try {
      const session = getActiveSession();
      if (session?.user) {
        setUserRole(session.user.role);
      }
    } catch (decodeError) {
      console.error("Erro ao recuperar sessão do usuário", decodeError);
      setErrorKey("header.error.session");
    }
  }, []);

  useEffect(() => {
    if (!errorKey) return;
    const timer = setTimeout(() => setErrorKey(""), 4000);
    return () => clearTimeout(timer);
  }, [errorKey]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setLanguageMenuOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    if (!languageMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageSelectorRef.current &&
        !languageSelectorRef.current.contains(event.target as Node)
      ) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [languageMenuOpen]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const handleLocaleChange = (value: "en" | "pt" | "es") => {
    setLocale(value);
    setLanguageMenuOpen(false);
  };

  const languageSelectId = useId();

  const languageOptions: Array<{ value: "en" | "pt" | "es"; label: string }> = useMemo(
    () => [
      { value: "en", label: t("language.option.en") },
      { value: "pt", label: t("language.option.pt") },
      { value: "es", label: t("language.option.es") },
    ],
    [t]
  );

  const languageSelector = (
    <div
      className="relative inline-flex text-xs font-semibold uppercase text-white"
      ref={languageSelectorRef}
    >
      <button
        type="button"
        id={languageSelectId}
        aria-haspopup="listbox"
        aria-expanded={languageMenuOpen}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 transition hover:border-white/30 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
        onClick={() => setLanguageMenuOpen((open) => !open)}
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
            <path d="M2 10h16" />
            <path d="M10 2s3 3.5 3 8-3 8-3 8" />
            <path d="M10 2s-3 3.5-3 8 3 8 3 8" />
          </svg>
        </span>
        <span>{locale.toUpperCase()}</span>
        <svg
          className={`h-3 w-3 transition-transform ${languageMenuOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 8l4 4 4-4" />
        </svg>
      </button>
      {languageMenuOpen && (
        <ul
          className="absolute right-0 z-50 mt-2 w-28 rounded-xl border border-white/15 bg-slate-900/95 p-1 text-xs shadow-lg backdrop-blur-xl"
          role="listbox"
          aria-labelledby={languageSelectId}
        >
          {languageOptions.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={locale === option.value}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-white/10 ${
                  locale === option.value ? "bg-white/10 text-white" : "text-slate-200"
                }`}
                onClick={() => handleLocaleChange(option.value)}
              >
                <span>{option.label}</span>
                {locale === option.value && (
                  <svg
                    className="h-3 w-3 text-sky-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414 0L5.293 9.414a1 1 0 011.414-1.414l2.828 2.829 5.657-5.657a1 1 0 011.415 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 text-lg font-bold text-sky-300 ring-1 ring-sky-500/30">
            ER
          </span>
          <div>
            <span className="block text-sm font-semibold uppercase tracking-widest text-slate-400">
              {t("header.brand.tagline")}
            </span>
            <span className="block text-lg font-semibold text-white">
              {t("header.brand.product")}
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              router.pathname === link.href ||
              router.pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={handleLogout} className="primary-button">
            {t("header.button.logout")}
          </button>
          {userRole === "admin" && (
            <Link href="/admin/dashboard" className="secondary-button">
              {t("header.nav.admin")}
            </Link>
          )}
          <div className="ml-3">{languageSelector}</div>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-white/30 hover:bg-white/10"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <path d="M4 12h16" />
                <path d="M4 6h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="mx-4 mb-4 space-y-2 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl">
            {navLinks.map((link) => {
              const isActive =
                router.pathname === link.href ||
                router.pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-2xl px-3 py-2 text-base font-medium transition ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl bg-sky-500/90 px-3 py-2 text-base font-semibold text-white transition hover:bg-sky-400 sm:w-auto"
              >
                {t("header.button.logout")}
              </button>
              {userRole === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="block rounded-2xl bg-white/15 px-3 py-2 text-base font-semibold text-white transition hover:bg-white/25 sm:w-auto"
                >
                  {t("header.nav.admin")}
                </Link>
              )}
            </div>
            <div className="flex justify-end pt-2">{languageSelector}</div>
          </div>
        </div>
      )}

      {errorKey && (
        <div className="mx-auto max-w-6xl px-6 pb-4 text-sm text-rose-300">
          {t(errorKey)}
        </div>
      )}
    </header>
  );
};

export default Header;
