import { GetServerSideProps, NextPage } from "next"
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { v4 as uuid } from 'uuid';
import LocalStorage from "helper/ls";
import { dateFormat } from "helper/utils";
import Layout from "@/components/Layout";
import DdayCountdown from "@/components/DdayCountdown";
import { setYear } from "date-fns";
import PostForm from "@/components/PostForm";

const ls = new LocalStorage();
const PaperMain: NextPage<{paper: PaperData;}> = ({paper}) => {
  console.log(paper)
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null)
  const [targetPost, setTargetPost] = useState<PostData>();
  const [postKey, setPostKey] = useState<string|null>(); 
  const [btnText, setBtnText] = useState<string>('');
  const [birthDay, setBirthDay] = useState<Date>(new Date(paper.friendBirth));

  useEffect(() => {
    if (!paper) return;
    const postKey = ls.getItem(`${router.query.uid}`);
    const targetPost = paper.posts.find(({key}) => key === postKey);
    setTargetPost(targetPost);
    setPostKey(postKey ? postKey : null);
    setBtnText(!targetPost ? '메시지 등록' : '메시지 수정');
  }, []);

  const onPostSubmit = async (ev: MouseEvent) => { // 롤링페이퍼 메시지 등록
    ev.preventDefault();
    try {
      const key = uuid();
      if (postKey === null) {
        ls.setItem(`${router.query.uid}`, `${key}`);
        setPostKey(key);
      }
      const form = formRef?.current as HTMLFormElement;
      // FIXME: 사파리 axios 호환 안됨. ky 라이브러리 검토
      await axios.post(`/api/paper/${router.query.uid}`, {
        key: !postKey ? key : ls.getItem(`${router.query.uid}`),
        name: form.username.value,
        message: form.message.value,
        updateDate: new Date(),
        ...!postKey && {initDate: new Date()}
      });
      router.push('/');
      return false;
    } catch (e: any) {
      throw Error(e)
    }
  }

  if (!paper) {
    return <Layout title="메시지 남기기">
      <div>존재하지 않는 롤링페이퍼입니다</div>
    </Layout>
  }
  return <Layout title="메시지 남기기">
    <div className="w-full lg:w-10/12 mx-auto">
      <div>D-day!</div>
      <DdayCountdown dDay={birthDay} />
      <div>{paper.friendName}에게 전하고 싶은 말은 남겨줘!</div>
      {!paper.isCompleted 
      ? <div>
        <PostForm ref={formRef} targetPost={targetPost} onPostSubmit={onPostSubmit} btnText={btnText} />
      </div> 
      : <div>
        <Link href={`/complete/${paper.completedUid}`}>
          <a>완성 된 롤링페이퍼 보기</a>
        </Link>
      </div>}
      <div>(만든 친구: {paper.userName})</div>
    </div>
  </Layout>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/paper/${context.query.uid}`);
  // FIXME: api에서 넘어오는 friendBirth 데이터 타입 구분
  const data: {paper: PaperData} = await res.json();
  return {
    props: {
      paper: data.paper // {...data.paper, friendBirth: new Date(data.paper.friendBirth)}
    }
  }
}

export default PaperMain;
