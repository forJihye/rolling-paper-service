import Checkbox from "@/components/Checkbox";
import Layout from "@/components/Layout";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";

const PaperAdmin: NextPage<{paper: PaperData}> = ({paper}) => {
  const router = useRouter();
  const [isSelect, setIsSelect] = useState(false);
  const [checkedPosts, setCheckedPosts] = useState(new Set());

  const checkedHandler = (id: string, isChecked: boolean) => {
    if (isChecked) {
      checkedPosts.add(id);
      setCheckedPosts(checkedPosts);
    } else if (!isChecked && checkedPosts.has(id)) {
      checkedPosts.delete(id);
      setCheckedPosts(checkedPosts);
    }
  };

  const postDeleteHandler = async (ev: MouseEvent) => {
    if (isSelect) {
      if (checkedPosts.size > 0) {
        if(window.confirm('삭제 하시겠습니까?')) {
          const {data: {data}} = await axios.delete(`/api/paper/${router.query.uid}/posts`, { data: { posts: [...checkedPosts] } });
          router.reload();
        }
      }
      setIsSelect(false);
    } else {
      setIsSelect(true);
    }
  }
  
  return <Layout title="페이퍼 관리">
    <div>{paper.friendName}에게 남겨진 메시지</div>
    {paper.posts.length && <div onClick={postDeleteHandler}>{!isSelect ? '선택' : '완료'}</div>}

    {!paper.posts.length && <div>남겨진 메시지가 없습니다.</div>}
    <ul>
    {paper.posts.map((post, i) => {
      return <li key={`post-${i}`} className="p-5 bg-neutral-300 mb-4">
        {isSelect && <Checkbox name={`post-${i}`} id={post.key} checkedHandler={checkedHandler} />}
        <p>{post.name}</p>
        <p>{post.message}</p>
      </li>
    })}
    </ul>
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
    const data: {paper: PaperData} = await res.json();
    return {
      props: {
        paper: data.paper
      }
    }
  }
}

export default PaperAdmin;