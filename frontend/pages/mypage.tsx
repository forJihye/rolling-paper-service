import { GetServerSideProps, NextPage } from "next";
import { MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import Layout from "@/components/layout"

const Mypage: NextPage<{papers: PaperData[]}> = ({papers}) => {
  const [state, setState] = useState<PaperData[]>([]);

  useEffect(() => {
    setState(papers);
  }, []);

  // 롤링 페이퍼 삭제
  const onPaperDelete = (uid: string) => async (ev: MouseEvent) => {
    ev.preventDefault();
    const confirm = window.confirm('삭제 하시겠습니까? \n남겨진 메시지도 함께 삭제 됩니다');
    if (!confirm) return;
    try {
      await axios.delete(`/api/paper/${uid}`);
      Router.reload();
    } catch (e: any) {
      throw Error(e)
    }
  }
  
  // 롤링 페이퍼 완성
  const onPaperComplete = (uid: string) => async (ev: MouseEvent) => {
    ev.preventDefault();
    const confirm = window.confirm('완성 하시겠습니까? \n완성된 롤링페이퍼에 더 이상 메시지를 남길 수 없습니다.');
    if (!confirm) return;
    try {
      const {data} = await axios.post(`/api/complete`, { uid });
      const completedUid = data.completedUid;
      Router.push({
        pathname: '/complete/[uid]',
        query: { 
          uid: completedUid
        },
      });
    } catch (e: any) {
      throw Error(e)
    }
  }

  return <Layout>
    <div className="w-full lg:w-10/12 mx-auto mb-10">
      <p className="text-xl">내가 만든 롤링페이퍼</p>
      <ul>
        {!state.length 
        ? <div>만든 롤링페이퍼 없음.</div> 
        : state.map((paper, i) => {
          return <li key={`paper-${i}`} className='py-5 border-t border-gray-300 border-solid text-sm'>
            <div>친구 이름: {paper.friendName}</div>
            <div>친구 생일: {paper.friendBirth}</div>
            <div>내 이름: {paper.userName}</div>
            <div style={{fontSize: 13}}>{paper.uid}</div>
            <Link href={`paper/${paper.uid}`}>
              <a className='inline-block py-2 px-4 text-sm text-center text-white bg-yellow-500 rounded-md shadow-md'>메시지 남기기</a>
            </Link>
            {!paper.isCompleted 
            ?  <>
              <button 
                onClick={onPaperDelete(paper.uid)}
                className='inline-block py-2 px-4 text-sm text-center text-white bg-slate-400 rounded-md shadow-md'
              >페이퍼 삭제</button>
              <button 
                onClick={onPaperComplete(paper.uid)}
                className='inline-block py-2 px-4 text-sm text-center text-white bg-lime-500 rounded-md shadow-md'
              >페이퍼 완성</button> 
            </>
            : <Link href={{
                pathname: `complete/[uid]`,
                query: { 
                  uid: paper.completedUid 
                },
              }}>
                <a className='inline-block py-2 px-4 text-sm text-center text-white bg-lime-500 rounded-md shadow-md'>롤링페이퍼 보기</a>
              </Link>
            }
          </li>
        })}
      </ul>
    </div>
  </Layout>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/paper`, {
    headers: {
      cookie: context.req.headers.cookie || "",
    },
  });
  const data: {papers: PaperData[]} = await res.json();
  return {
    props: {
      papers: data.papers
    }
  }
}

export default Mypage;