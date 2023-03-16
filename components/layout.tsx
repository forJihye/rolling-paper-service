import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Layout({ title = '', children, ...props }: {title?: string; children: React.ReactNode}) {
  const { data: session } = useSession();
  // console.log(session);
  // flex-auto
  return <div {...props} className="w-full min-h-screen flex flex-col justify-start py-12">
    <Head>
      <title>My Friends Rolling Paper {title}</title>
    </Head>
    <div className="w-[480px] mx-auto neumorphism rounded-lg">
      <nav className="py-3 px-4 w-full flex justify-between items-center text-stone-900">
        <Link href='/'>
          <a className="text-gray-500">HOME</a>
        </Link>
        <div className="cursor-pointer text-gray-500 hover:text-pink transition-colors" id="navbar-collapse">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          {/* <Link href='/'>
            <a className="p-2 lg:px-4 md:mx-2 text-indigo-600">Home</a>
          </Link>
          {!session 
          ? <Link href='/login'>
            <a className="p-2 lg:px-4 md:mx-2 text-indigo-600">로그인 하기</a>
          </Link>
          : <>
            <Link href='/mypaper'>
              <a className="p-2 lg:px-4 md:mx-2 text-indigo-600">마이페이퍼</a>
            </Link>
            <a onClick={(ev) => {
                ev.preventDefault();
                signOut({callbackUrl: '/'});
              }} 
              className="p-2 lg:px-4 md:mx-2 text-indigo-600 text-center rounded first:border border-solid border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300"
            >로그아웃 ({session.user?.name} / <small>{session.user?.email}</small>) </a>
          </>
          } */}
        </div>
      </nav>
      <main className="w-full py-9">
        {children}
      </main>
    </div>
    {/* <footer className='shrink-0 flex justify-center items-center py-5 border-t border-solid border-gray-500'>
      <p>footer</p>  
    </footer> */}
  </div>
}