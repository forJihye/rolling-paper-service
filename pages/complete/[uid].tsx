import { GetServerSideProps, NextPage } from "next";
import Layout from "@/components/Layout";

const PaperDetail: NextPage<{data: CompletedPaper}> = ({data}) => {
  
  if (!data?.posts.length) {
    return <Layout>
      <div className="py-12 text-center">
        <div className="text-xl text-gray-500 mb-4">남겨진 메시지가 없어요 T_T</div>
      </div> 
    </Layout> 
  } else {
    return <Layout>
      <h1>완성 롤링페이퍼</h1>
      {data?.posts.map((post, i) => {
        return <div key={`post-${i}`}>
          <div>{post.name}</div>
          <div>{post.message}</div>
        </div>
      })}
    </Layout>
  }
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