import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "@/components/Layout";
import ky from "ky";
import PostAdmin from "@/components/PostAdmin";

export type PaperPostData = {
  uid: string;
  userId: string;
  userName: string;
  friendName: string;
  friendBirth: string;
  completedUid: string;
  isCompleted: boolean;
  posts: (PostData & {checked: boolean})[];
}

const PaperAdmin: NextPage<{paper: PaperPostData}> = ({paper}) => {
  const router = useRouter();
  const [posts, setPosts] = useState<PaperPostData["posts"]>(paper.posts);

  const onPostDelete = async (posts: PaperPostData["posts"]) => {
    const confirm = window.confirm('선택한 메시지를 삭제할까요?');
    if (!confirm) return;
    await ky.delete(`/api/paper/${router.query.uid}/posts`, { json: { postKeys: posts.map(({key}) => key) } });
    router.reload();
  }
  
  return <Layout title="메시지 관리">
    <div className="w-full px-6">
      <div className="text-2xl text-gray-500 tracking-tight"><span className="text-pink">{paper.friendName}</span>에게 남겨진 메시지</div>
      <PostAdmin posts={posts} setPosts={setPosts} onPostDelete={onPostDelete} />
    </div>
  </Layout>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session === null || !session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props:{},    
    }
  } else {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/paper/${context.query.uid}`);
    const { paper }: {paper: PaperData} = await res.json();
    return {
      props: {
        paper: !paper ? null : {...paper, posts: paper.posts.map(post => ({...post, checked: false }))}
      }
    }
  }
}

export default PaperAdmin;