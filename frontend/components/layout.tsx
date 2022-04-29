import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import styles from '../styles/Layout.module.css';

export default function Layout({title = '', children, ...props}: {title?: string; children: React.ReactNode}) {
  const session = useSession();

  return <div {...props} className={styles.container}>
    <Head>
      <title>롤링 페이터 {title}</title>
    </Head>
    <main className={styles.main}>
      {children}
      {session && <div className="fixed right-3 top-3 px-6 py-3 rounded-md bg-black text-white">
        <a href="/api/auth/signout">로그아웃</a>
      </div>}
    </main>
    <footer className={styles.footer}>
      <p>footer</p>  
    </footer>
  </div>
}