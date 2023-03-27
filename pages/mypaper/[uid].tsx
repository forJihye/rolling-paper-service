import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "@/components/Layout";
import PostAdmin from "@/components/PostAdmin";
import ky from "ky";
import Link from "next/link";

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
  
  if (!posts.length) {
    return <Layout flexCenter={true}>
      <div className="text-2xl text-gray-500 text-center leading-10">😱<br/>남겨진 메시지가 없어요 T_T</div>
      <div className="pt-8 text-center">
        <Link href={`/paper/${router.query.uid}`}>
          <a className="block w-full py-5 px-12 mx-auto text-center rounded-full text-gray-500 neumorphism hover:shadow-inset hover:text-pink">메시지 남기러 가자 🤸🏻</a>
        </Link>
      </div>
    </Layout>
  }
  
  return <Layout>
    <div className="w-full px-6 py-10">
      <div className="text-2xl text-gray-500 tracking-tight text-center"><span className="text-pink">{paper.friendName}</span>에게 남겨진 메시지</div>
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