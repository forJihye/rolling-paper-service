import { NextPage } from 'next';
import Link from 'next/link';
import Layout from "@/components/Layout";

const Home: NextPage = () => {
  return (
    <Layout flexCenter={true}>    
      <h1 className='text-3xl text-pink tracking-tighter mb-7'>My Friends Rolling Paper</h1>
      <div className='text-xl text-gray-500 tracking-tight leading-9'> 다가오는 친구 생일선물을 위해<br/>내 친구만의 롤링페이퍼를 만들어<br/>내 친구에게 선물하자! </div>
      <div className='text-center pt-14'>
        <Link href='/paper'>
          <a className="inline-block py-5 px-12 mx-auto text-center rounded-full text-pink neumorphism hover:shadow-inset">여기를 클릭하세요 !</a>
        </Link>
      </div>
    </Layout>
  )
}

export default Home
