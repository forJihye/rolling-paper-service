import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Layout({ title = '', children, flexCenter, ...props }: {title?: string; children: React.ReactNode, flexCenter?: boolean}) {
  const { data } = useSession();
  const session = data as UserSession;
  
  return <div {...props} className="w-[360px] sm:w-[480px] h-full mx-auto py-12">
    <Head>
      <title>My Friends Rolling Paper {title}</title>
    </Head>
    <div className="w-full min-h-full flex flex-col neumorphism rounded-lg">
      <nav className="py-3 px-3 sm:px-6 w-full flex flex-row justify-start items-center">
        <Link href='/'>
          <a className="flex justify-center items-center text-gray-500 hover:text-pink w-12 h-12 rounded-full bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </a>
        </Link>
        <div className="flex ml-auto justify-center items-center">
          {!session 
          ? <Link href='/login'>
              <a className="flex justify-center items-center text-gray-500 hover:text-pink w-12 h-12 rounded-full bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </a>
            </Link> 
          : <>
            <div className="text-sm text-gray-500 pr-2 tracking-tighter"> {session.name} ({session.email}) </div>
            <Link href='/mypaper'>
              <a className="mr-2 sm:mr-4 flex justify-center items-center text-gray-500 hover:text-pink w-12 h-12 rounded-full bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </a>
            </Link>
            <div onClick={(ev) => signOut({callbackUrl: '/'})} className="flex justify-center items-center text-gray-500 hover:text-pink w-12 h-12 rounded-full bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </div>
          </>}
        </div>
      </nav>
      <main className={`w-full h-full flex-1 relative ${flexCenter ? 'flex flex-col justify-center items-center text-center' : ''}`}>
        {children}
      </main>
      <footer className='shrink-0 py-3 border-t border-solid border-gray-300 text-center text-gray-400 text-sm'>
        &copy; 2023. Park Jihye all rights reserved.
      </footer>
    </div>
  </div>
}