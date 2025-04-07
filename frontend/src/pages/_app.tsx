import '../styles/globals.css'; // ajuste o caminho se necessário
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}