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

const ls = new LocalStorage();

const PaperMain: NextPage<{paper: PaperData;}> = ({paper}) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null)
  
  const [targetPost, setTargetPost] = useState<PostData|null>(null);
  const [postKey, setPostKey] = useState<string|null>(); 
  const [btnText, setBtnText] = useState<string>('');
  const [birthDay, setBirthDay] = useState<any>();

  useEffect(() => {
    if (!paper) return;
    const postKey = ls.getItem(`${router.query.uid}`);
    const targetPost = paper.posts.find(({key}) => key === postKey) as PostData;
    setTargetPost(targetPost);
    setPostKey(postKey ? postKey : null);
    setBtnText(!targetPost ? '메시지 등록' : '메시지 수정');
    setBirthDay(paper.friendBirth);
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

  const postFormRender = (postKey: number|null, targetPost: PostData) => {
    if (!postKey) {
      return <form className="grid grid-cols-1 gap-4" ref={formRef}>
        <input type="text" name="username" id="username" maxLength={4} 
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="내 이름"
        />
        <textarea name="message" id="message" rows={8}
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="메시지"
        />
        <button
          onClick={onPostSubmit}
          className="py-3 px-6 text-center text-white bg-yellow-500 rounded-md shadow-md"
        >{btnText}</button>
      </form> 
    }
    if (postKey && targetPost) {
      return <>
        <form className="grid grid-cols-1 gap-4" ref={formRef}>
          <input type="text" name="username" id="username" maxLength={4} 
            className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
            placeholder="내 이름"
            defaultValue={targetPost.name}
          />
          <textarea name="message" id="message" rows={8}
            className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
            placeholder="메시지"
            defaultValue={targetPost.message}
          />
          <button
            onClick={onPostSubmit}
            className="py-3 px-6 text-center text-white bg-yellow-500 rounded-md shadow-md"
          >{btnText}</button>
        </form> 
        <div className="text-right mt-6">
          <div className='text-sm'>처음 등록날: {dateFormat(targetPost.initDate)}</div>
          <div className='text-sm'>마지막 수정날: {dateFormat(targetPost.updateDate)}</div>
        </div>
      </>
    }
  }

  if (!paper) {
    return <Layout title="메시지 남기기">
      <div>존재하지 않는 롤링페이퍼입니다</div>
    </Layout>
  }
  return <Layout title="메시지 남기기">
    <div className="w-full lg:w-10/12 mx-auto">
      <div>생일까지 D-day!</div>
      <DdayCountdown dDay={setYear(new Date(paper.friendBirth), new Date().getFullYear())} />
      <div>{paper.friendName}에게 메시지 남기기 ! (만든 친구: {paper.userName})</div>
      {!paper.isCompleted ? <div>{postFormRender(postKey as (number|null), targetPost as (PostData))}</div> : <div>
        <Link href={`/complete/${paper.completedUid}`}>
          <a>완성 된 롤링페이퍼 보기</a>
        </Link>
      </div>}
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
