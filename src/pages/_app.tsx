import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { LocaleProvider } from '../context/LocaleContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocaleProvider>
      <Component {...pageProps} />
    </LocaleProvider>
  );
}
