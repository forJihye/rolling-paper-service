import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Layout({title = '', children, ...props}: {title?: string; children: React.ReactNode}) {
  const session = useSession();
  console.log('session', session)
  return <div {...props} className="w-full min-h-screen flex flex-col bg-white">
    <Head>
      <title>롤링 페이터 {title}</title>
    </Head>
    <div className="w-full flex-auto">
      <nav className="bg-white py-3 px-4">
        <div className="w-11/12 sm:w-9/12 md:w-7/12 lg:w-5/12 mx-auto flex justify-between items-center">
          <div>LOGO</div>
          <div className="ml-auto" id="navbar-collapse">
            <Link href='/'>
              <a className="p-2 lg:px-4 md:mx-2 text-indigo-600">Home</a>
            </Link>
            {session.data && <Link href='/main'>
              <a className="p-2 lg:px-4 md:mx-2 text-indigo-600">Main</a>
            </Link>}
            {!session.data 
            ? <Link href='/login'>
              <a className="p-2 lg:px-4 md:mx-2 text-indigo-600">로그인 하기</a>
            </Link>
            : <>
              <Link href='/mypage'>
                <a className="p-2 lg:px-4 md:mx-2 text-indigo-600">Mypage</a>
              </Link>
              <a onClick={(ev) => {
                  ev.preventDefault();
                  signOut({callbackUrl: '/'});
                }} 
                className="p-2 lg:px-4 md:mx-2 text-indigo-600 text-center rounded first:border border-solid border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300"
              >로그아웃</a>
            </>
            }
          </div>
        </div>
      </nav>
      <main className="w-11/12 sm:w-9/12 md:w-6/12 lg:w-5/12 mx-auto flex-auto py-20">
        {children}
      </main>
    </div>
    <footer className='shrink-0 flex justify-center items-center py-5 border-t border-solid border-gray-500'>
      <p>footer</p>  
    </footer>
  </div>
}