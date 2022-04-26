import type { NextPage } from 'next';
import { signIn, signOut, getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../components/layout';

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading"

  // When rendering client side don't display anything until loading is complete
  // if (typeof window !== "undefined" && loading) return null
  return (
    <Layout>    
      <h1>Wellcom</h1>
      {!session && <>
        <a 
          // href="/api/auth/signin" 
          onClick={(ev) => {
            ev.preventDefault();
            signIn()
          }}
        >Sign in with Google</a>
      </>}
      {session?.user && <>
        <a 
          // href={`/api/auth/signout`} 
          onClick={(e) => {
            e.preventDefault()
            signOut()
          }}
        >Sing out {session.user.name ?? session.user.email}</a>
        <br />
        <nav>
          <li>
            <Link href="/me">내 정보 보기</Link>
          </li>
          <li>
            <Link href="/api-example">API 예시</Link>
          </li>
        </nav>
      </>}
    </Layout>
  )
}

export default Home
