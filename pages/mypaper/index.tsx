import { GetServerSideProps, NextPage } from "next";
import { MouseEvent, useEffect, useState } from "react";
import ky from "ky";
import Router from "next/router";
import Layout from "@/components/Layout";
import UserPaperList from "@/components/UserPaperList";
import { getSession } from "next-auth/react";

const MyPapers: NextPage<{papers: UserPapers}> = ({papers}) => {
  const [usePapers, setUserPapers] = useState<UserPapers>(null);

  useEffect(() => {
    setUserPapers(papers);
  }, []);

  // 롤링 페이퍼 삭제
  const onPaperDelete = (uid: string) => async (ev: MouseEvent) => {
    ev.preventDefault();
    const confirm = window.confirm('남겨진 메시지도 함께 삭제 됩니다.\n삭제 하시겠습니까?');
    if (!confirm) return;
    try {
      await ky.delete(`/api/paper/${uid}`);
      Router.reload();
    } catch (e: any) {
      throw Error(e);
    }
  }
  
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

  return <Layout>
    <div className="w-full lg:w-10/12 mx-auto mb-10">
      <p className="text-xl">내가 만든 내친구 롤링페이퍼</p>
      <UserPaperList
        papers={usePapers}
        onPaperReMake={onPaperReMake}
        onPaperDelete={onPaperDelete}
        onPaperComplete={onPaperComplete}
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
      props:{},    
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
        papers: data.papers
      }
    }
  }
}

export default MyPapers;