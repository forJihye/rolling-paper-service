import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { getSession, SessionProvider } from 'next-auth/react';
import { GetServerSideProps } from 'next';

function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return <SessionProvider session={session} >
    <Component {...pageProps} session={session} />
  </SessionProvider>
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context);
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {
//       session
//     }
//   }
// }

export default App
