import { GetServerSideProps, NextPage } from "next";
import Layout from "../../components/Layout";

const PaperDetail: NextPage<{data: CompletedPaper}> = ({data}) => {
  if (!data?.posts.length) {
    return <Layout flexCenter={true}>
      <div className="py-14 text-center text-3xl text-gray-500 leading-10">😱<br/>남겨진 메시지가 없어요 T_T</div>
    </Layout> 
  } 
  
  return <Layout>
    <div className="px-6 pt-10 pb-14">
      <h1 className="text-2xl tracking-tight text-center text-gray-500">💌 <span className="text-pink">롤링페이퍼</span> 도착 💌</h1>
      <div className="mt-6">
        {data?.posts.map((post, i) => {
          return <div key={`post-${i}`} className='mt-5 p-4 text-lg bg-neumorphism shadow-insetthin rounded-lg'>
            <div className="text-pink">{post.name}</div>
            <div className="text-gray-500 whitespace-pre-line">{post.message}</div>
          </div>
        })}
      </div>
    </div>
  </Layout>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/complete/${context.query.uid}`, {
    headers: {
      cookie: context.req.headers.cookie || "",
    }
  });
  const {data} = await res.json();
  return {
    props: {
      data: data
    }
  }
}
export default PaperDetail;