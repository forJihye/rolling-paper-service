import { GetServerSideProps, NextPage } from "next";
import { MouseEvent, useEffect, useState } from "react";
import Router from "next/router";
import axios from "axios";
import Layout from "@/components/Layout";
import UserPaperList from "@/components/UserPaperList";

const MyPapers: NextPage<{papers: UserPapers}> = ({papers}) => {
  const [usePapers, setUserPapers] = useState<UserPapers>(null);

  useEffect(() => {
    setUserPapers(papers);
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
      const {data: {data}} = await axios.put(`/api/complete`, { uid });
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
      <p className="text-xl">내가 만든 내친구 롤링페이퍼</p>
      <UserPaperList
        papers={usePapers}
        onPaperDelete={onPaperDelete}
        onPaperComplete={onPaperComplete}
      />
    </div>
  </Layout>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/paper`, {
    headers: {
      cookie: context.req.headers.cookie || "",
    },
  });
  const data: {papers: UserPapers} = await res.json();
  return {
    props: {
      papers: data.papers
    }
  }
}

export default MyPapers;