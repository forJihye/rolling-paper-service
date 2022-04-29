import { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import Layout from '../components/layout';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.push('/main');
    }
  }, []);

  return (
    <Layout>    
      <h1>Wellcom</h1>
      {!session && <>
        <p>서비스 이용하기</p>
        <a onClick={(ev) => {
            ev.preventDefault();
            signIn('google', {callbackUrl: '/main'});
          }}
        >Google 로그인</a>
      </>}
    </Layout>
  )
}

export default Home
