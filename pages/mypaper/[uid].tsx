import Layout from "@/components/Layout";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

const PaperAdmin: NextPage<{paper: PaperData}> = ({paper}) => {
  const router = useRouter()
  
  return <Layout title="페이퍼 관리">
    <div>{paper.friendName}에게 남겨진 메시지</div>
    <div>선택</div>

    {!paper.posts.length && <div>남겨진 메시지가 없습니다.</div>}
    <ul>
    {paper.posts.map((post, i) => {
      return <li key={`post-${i}`} className="p-5 bg-neutral-300 mb-4">
        <p>선택</p>
        <p>{post.name}</p>
        <p>{post.message}</p>
      </li>
    })}
    </ul>
  </Layout>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/paper/${context.query.uid}`);
  const data: {paper: PaperData} = await res.json();
  return {
    props: {
      paper: data.paper
    }
  }
}

export default PaperAdmin;