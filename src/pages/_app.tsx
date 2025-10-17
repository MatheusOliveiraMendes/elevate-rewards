import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { LocaleProvider } from '../context/LocaleContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocaleProvider>
      <>
        <Head>
          <title>Elevate Rewards</title>
        </Head>
        <Component {...pageProps} />
      </>
    </LocaleProvider>
  );
}
