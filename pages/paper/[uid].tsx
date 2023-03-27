import { GetServerSideProps, NextPage } from "next"
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import ky from 'ky';
import Link from "next/link";
import { v4 as uuid } from 'uuid';
import LocalStorage from "helper/ls";
import Layout from "@/components/Layout";
import DdayCountdown from "@/components/DdayCountdown";
import PostForm from "@/components/PostForm";

const ls = new LocalStorage();
const PaperMain: NextPage<{paper: PaperData;}> = ({paper}) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [targetPost, setTargetPost] = useState<PostData>();
  const [postKey, setPostKey] = useState<string|null>(); 
  const [btnText, setBtnText] = useState<string>('');
  
  useEffect(() => {
    if (!paper) return;
    const postKey = ls.getItem(`${router.query.uid}`);
    const targetPost = paper.posts.find(({key}) => key === postKey);
    setTargetPost(targetPost);
    setPostKey(postKey ? postKey : null);
    setBtnText(!targetPost ? '남기기' : '수정할래');
  }, [paper, router.query.uid]);

  const onPostSubmit = async (ev: MouseEvent) => { // 롤링페이퍼 메시지 등록
    ev.preventDefault();
    try {
      const key = uuid();
      if (postKey === null) {
        ls.setItem(`${router.query.uid}`, `${key}`);
        setPostKey(key);
      }
      const form = formRef?.current as HTMLFormElement;
      const nameVal = form.username.value;
      const messageVal = form.message.value;
      if (!nameVal.length || !messageVal.length) return;
      const response = await ky.post(`/api/paper/${router.query.uid}`, {
        json: {
          key: !postKey ? key : ls.getItem(`${router.query.uid}`),
          name: nameVal,
          message: messageVal,
          updateDate: new Date(),
          ...!postKey && {initDate: new Date()}
        },
        credentials: 'same-origin'
      });
      await response.json();
      router.reload();
    } catch (e: any) {
      throw Error(e)
    }
  }

  if (!paper) {
    return <Layout flexCenter={true}>
      <div className="py-14 text-center text-3xl text-gray-500 leading-10">😱<br/>롤링페이퍼를 찾을 수가 없어요!</div>
    </Layout>
  }
  return <Layout title="">
    <div className="w-full px-6 py-10">
      <div className="w-full text-right mb-5">
        <span className="text-pink text-base">생일 D-Day</span><DdayCountdown dDay={new Date(paper.friendBirth)} />
      </div>
      <div className="text-center mb-6">
        <div className="text-xl text-gray-500"><span className="text-pink">{paper.friendName}</span>에게 하고 싶은 말을 남겨줘!</div>
        <div className="text-sm text-gray-500 mt-2">욕설과 비난은 {paper.friendName}의 마음을 아프게 합니다 😥</div>
      </div>
      {!paper.isCompleted 
      ? <PostForm ref={formRef} targetPost={targetPost as PostData} onPostSubmit={onPostSubmit} btnText={btnText} userName={paper.userName} /> 
      : <div className="pt-8">
        <Link href={`/complete/${paper.completedUid}`}>
          <a className="block w-full py-5 px-12 mx-auto text-center rounded-full text-gray-500 neumorphism hover:shadow-inset">롤링페이퍼가 <span className="text-pink">완성</span>됐어요 💝</a>
        </Link>
      </div>
      }
    </div>
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

export default PaperMain;
