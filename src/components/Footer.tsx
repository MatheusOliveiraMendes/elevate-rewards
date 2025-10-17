import React from "react";
import Link from "next/link";
import { useLocale } from "../context/LocaleContext";

const socialLinks = [
  {
    label: "Github",
    href: "https://github.com",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.476 2 2 6.486 2 12.02c0 4.425 2.868 8.18 6.842 9.502.5.092.683-.217.683-.483 0-.238-.008-.869-.013-1.704-2.784.605-3.373-1.344-3.373-1.344-.455-1.158-1.111-1.466-1.111-1.466-.909-.62.069-.608.069-.608 1.004.07 1.533 1.032 1.533 1.032.893 1.53 2.343 1.088 2.912.832.092-.647.35-1.088.637-1.338-2.221-.253-4.558-1.114-4.558-4.953 0-1.093.39-1.988 1.029-2.688-.103-.253-.447-1.272.098-2.651 0 0 .84-.27 2.751 1.026A9.56 9.56 0 0112 6.844c.851.004 1.707.115 2.506.337 1.91-1.295 2.75-1.027 2.75-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.847-2.341 4.695-4.57 4.943.36.309.68.92.68 1.855 0 1.338-.012 2.419-.012 2.747 0 .269.181.58.69.481A10.02 10.02 0 0022 12.02C22 6.486 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19 0h-14a5 5 0 00-5 5v14a5.006 5.006 0 005 5h14a5.006 5.006 0 005-5V5a5 5 0 00-5-5zm-11 20H5V9h3zm-1.5-12a1.75 1.75 0 111.75-1.75A1.75 1.75 0 016.5 8zm14.5 12h-3v-5.6c0-1.334-.027-3.05-1.859-3.05-1.862 0-2.148 1.454-2.148 2.953V20h-3V9h2.882v1.5h.041a3.166 3.166 0 012.848-1.566c3.046 0 3.61 2.005 3.61 4.61z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21.543 3.5a13.172 13.172 0 01-3.772 1.034 6.588 6.588 0 002.887-3.63 13.153 13.153 0 01-4.169 1.593A6.563 6.563 0 0015 1.727a6.563 6.563 0 00-6.563 6.563c0 .514.058 1.014.17 1.494A18.645 18.645 0 012.225 2.4a6.564 6.564 0 002.03 8.76 6.518 6.518 0 01-2.975-.822v.082a6.564 6.564 0 005.266 6.437 6.575 6.575 0 01-2.965.112 6.566 6.566 0 006.133 4.559A13.168 13.168 0 012 20.131a18.588 18.588 0 0010.063 2.95c12.075 0 18.675-10.007 18.675-18.675 0-.284-.006-.568-.02-.85A13.312 13.312 0 0024 2.557a13.148 13.148 0 01-3.808 1.043 6.56 6.56 0 002.87-3.6z" />
      </svg>
    ),
  },
];

const Footer = () => {
  const { t } = useLocale();

  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold text-white">
              ER
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {t("header.brand.tagline")}
              </p>
              <p className="text-lg font-semibold text-white">
                {t("header.brand.product")}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-slate-300">
            {t("footer.about")}
          </p>
        </div>

        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-12">
          <nav className="space-y-2 text-sm text-slate-300">
            <Link href="/dashboard" className="block hover:text-white">
              {t("footer.nav.dashboard")}
            </Link>
            <Link href="/wallet" className="block hover:text-white">
              {t("footer.nav.wallet")}
            </Link>
            <Link href="/admin/dashboard" className="block hover:text-white">
              {t("footer.nav.admin")}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-200 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <span className="sr-only">{item.label}</span>
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 bg-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-4 text-xs text-slate-400 md:flex-row">
          <span>
            © {new Date().getFullYear()} Elevate Rewards. {t("footer.copy")}
          </span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              {t("footer.link.privacy")}
            </a>
            <a href="#" className="hover:text-white">
              {t("footer.link.terms")}
            </a>
            <a href="#" className="hover:text-white">
              {t("footer.link.support")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
