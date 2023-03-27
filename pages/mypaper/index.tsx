import { GetServerSideProps, NextPage } from "next";
import { MouseEvent, useEffect, useState } from "react";
import ky from "ky";
import Router from "next/router";
import Layout from "@/components/Layout";
import UserPaperList from "@/components/UserPaperList";
import { getSession } from "next-auth/react";

export type MyPapersData = (PaperData & {checked: boolean})[];

const MyPapers: NextPage<{papers: MyPapersData}> = ({papers}) => {
  const [paperList, setPaperList] = useState<MyPapersData>([]);

  useEffect(() => {
    setPaperList(papers);
  }, [papers]);

  // 롤링 페이퍼 완성
  const onPaperComplete = (uid: string) => async (ev: MouseEvent) => {
    ev.preventDefault();
    const confirm = window.confirm('완성된 롤링페이퍼에 더 이상 메시지를 남길 수 없습니다.\n완성 하시겠습니까?');
    if (!confirm) return;
    try {
      const response = await ky.put(`/api/complete`, { json : uid });
      const {data} = await response.json();
      const completedUid = data.completedUid;
      Router.push({
        pathname: '/complete/[uid]',
        query: { 
          uid: completedUid
        },
      });
    } catch (e: any) {
      throw Error(e);
    }
  }

  const onPaperReMake = (uid: string) => async (ev: MouseEvent) => {
    ev.preventDefault();
    const confirm = window.confirm('롤링페이퍼 링크를 재발급 하시겠습니까?.\n이전 링크는 삭제되어 접속 불가능합니다.');
    if (!confirm) return;
    try {
      const response = await ky.post(`/api/paper/`, { json: {uid} });
      const data = await response.json();
      const newUid = data.uid;
      Router.push({
        pathname: '/paper/[uid]',
        query: { 
          uid: newUid
        },
      });
    } catch (e: any) {
      throw Error(e);
    }
  }
  
  // 롤링 페이퍼 삭제
  const onPaperDelete = async (checkedPaper: MyPapersData) => {
    try {
      const confirm = window.confirm('선택한 롤링페이퍼를 삭제할까요?\n남겨진 메시지도 모두 삭제되어요 T_T');
      if (!confirm) return;
      const paperKeys = checkedPaper.map(({uid}) => uid);
      await ky.delete(`/api/paper`, { json: { paperKeys } });
      Router.reload();
    } catch (e: any) {
      throw Error(e);
    }
  }
  
  return <Layout>
    <div className="w-full px-6">
      <div className="text-2xl text-pink tracking-tight">내가 만든 내 친구 롤링페이퍼</div>
      <UserPaperList
        papers={paperList}
        setPapers={setPaperList}
        onPaperReMake={onPaperReMake}
        onPaperComplete={onPaperComplete}
        onPaperListDelete={onPaperDelete}
      />
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
      props: {},    
    }
  } else {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/paper`, {
      headers: {
        cookie: context.req.headers.cookie || "",
      },
    });
    const data: {papers: UserPapers} = await res.json();
    return {
      props: {
        papers: !data.papers ? [] : data.papers.map(paper => ({...paper, checked: false}))
      }
    }
  }
}

export default MyPapers;