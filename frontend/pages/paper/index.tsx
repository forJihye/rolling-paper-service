import Layout from "@/components/layout";
import axios from "axios";
import Router from 'next/router';
import { NextPage } from "next";
import { MouseEvent, useRef } from "react";
import { fetcher } from "lib/fetcher";
import useSWR from "swr";
import Link from "next/link";

const PaperCreate: NextPage = () => {
  const {data, error} = useSWR<{data: PaperData[]}>('api/paper', fetcher);
  
  const nameRef = useRef<HTMLInputElement>(null);
  const birthRef = useRef<HTMLInputElement>(null);

  const onPaperSubmit = async (ev: MouseEvent) => {
    ev.preventDefault();
    const nameVal = nameRef.current?.value as string;
    const birthVal = birthRef.current?.value as string;
    if (!nameVal.length || !birthVal.length) return window.alert('잘못된 입력');
    try {
      const {data: {data}} = await axios('/api/paper', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          friendName: nameVal,
          friendBirth: birthVal
        }
      });
      Router.push(`/paper/${data.uid}`);
    } catch (err) {
      window.alert('오류 발생');
    }
  }

  const onPaperDelete = (uid: string) => async (ev: MouseEvent) => {
    ev.preventDefault();
    const confirm = window.confirm('삭제 하시겠습니까? \n남겨진 메시지도 함께 삭제 됩니다');
    if (!confirm) return;
    try {
      await axios.delete(`/api/paper/${uid}`);
    } catch (e: any) {
      throw Error(e)
    }
  }
  
  const onPaperComplete = (uid: string) => async (ev: MouseEvent) => {
    ev.preventDefault();
    const confirm = window.confirm('완성 하시겠습니까? \n완성된 롤링페이퍼에 더 이상 메시지를 남길 수 없습니다.');
    if (!confirm) return;
    try {
      const {data} = await axios.post(`/api/paper/${uid}`);
      const completedUid = data.completedUid;
      Router.push({
        pathname: '/paper/completed/[uid]',
        query: { 
          uid: completedUid
        },
      });
    } catch (e: any) {
      throw Error(e)
    }
  }

  if (error) return <Layout>401</Layout>
  if (!data) return <Layout>loading...</Layout>
  return <Layout>
    <div className="w-full lg:w-10/12 mx-auto mb-10">
      <p className="text-xl">내 친구 롤링페이퍼</p>
      <ul>
        {data.data.map((paper, i) => {
          return <li key={`paper-${i}`} className='py-5 border-t border-gray-300 border-solid text-sm'>
            <div>친구 이름: {paper.friendName}</div>
            <div>친구 생일: {paper.friendBirth}</div>
            <div>내 이름: {paper.userName}</div>
            <div style={{fontSize: 13}}>{paper.uid}</div>
            <Link href={`paper/${paper.uid}`}>
              <a className='inline-block py-2 px-4 text-sm text-center text-white bg-yellow-500 rounded-md shadow-md'>메시지 남기기</a>
            </Link>
            <button 
              onClick={onPaperDelete(paper.uid)}
              className='inline-block py-2 px-4 text-sm text-center text-white bg-slate-400 rounded-md shadow-md'
            >페이퍼 삭제</button>
            {!paper.isCompleted 
            ? <button 
                onClick={onPaperComplete(paper.uid)}
                className='inline-block py-2 px-4 text-sm text-center text-white bg-lime-500 rounded-md shadow-md'
              >페이퍼 완성</button> 
            : <Link href={{
                pathname: `paper/completed/[uid]`,
                query: { 
                  uid: paper.completedUid 
                },
              }}>
                <a className='inline-block py-2 px-4 text-sm text-center text-white bg-yellow-500 rounded-md shadow-md'>롤링페이퍼 보기</a>
              </Link>
            }
          </li>
        })}
      </ul>
    </div>
    <div className="w-full lg:w-10/12 mx-auto">
      <p className="text-xl">내 친구 롤링페이퍼 만들기</p>
      <form className="grid grid-cols-1 gap-4">
        <input type="text" name="friendName" id="friendName" maxLength={4} 
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="친구 이름" 
          ref={nameRef}
          defaultValue="홍길동"
        />
        <input type="text" name="friendBirth" id="friendBirth" maxLength={4} 
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="친구 생일 (ex: 0605)" 
          ref={birthRef}
          defaultValue="0706"
        />
        <button
          onClick={onPaperSubmit}
          className="py-3 px-6 text-center text-white bg-yellow-500 rounded-md shadow-md"
        >만들기</button>
      </form> 
    </div>
  </Layout>
}

export default PaperCreate;