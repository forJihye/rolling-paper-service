import { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../components/layout';

const Home: NextPage = () => {
  return (
    <Layout>    
      <h1>Wellcom</h1>
      <Link href='/paper'>
        <a className="inline-block py-2 px-6 text-center rounded text-whie bg-yellow-500 border-yellow-500 border-solid border hover:bg-white hover:text-yellow-500 transition-colors duration-300">롤링 페이퍼 만들기</a>
      </Link>
    </Layout>
  )
}

export default Home
