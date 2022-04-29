import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';

const Home: NextPage = () => {
  // const session = useSession();
  return (
    <Layout>    
      <h1>Wellcom</h1>
      <div>서비스 소개</div>
    </Layout>
  )
}

export default Home
