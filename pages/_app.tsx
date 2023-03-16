import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

function App({ Component, pageProps: { session, ...pageProps} }: AppProps<{session: Session & {id: string; emailVerified?: string;}}>) {
  return <SessionProvider session={session} >
    <Component {...pageProps} session={session} />
  </SessionProvider>
}

export default App
