import Head from "next/head";
import React from "react";
import styles from '../styles/Layout.module.css';

export default function Layout({title = '', children, ...props}: {title?: string; children: React.ReactNode}) {
  return <div {...props} className={styles.container}>
    <Head>
      <title>롤링 페이터 {title}</title>
    </Head>
    <main className={styles.main}>
      {children}
    </main>
    <footer className={styles.footer}>
      <p>footer</p>  
    </footer>
  </div>
}