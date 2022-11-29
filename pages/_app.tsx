import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

function App({ Component, pageProps: { session, ...pageProps} }: AppProps) {
  return <SessionProvider session={session} >
    <Component {...pageProps} session={session} />
  </SessionProvider>
}

export default App
