import Layout from "@/components/layout";
import axios from "axios";
import Router from 'next/router';
import { GetServerSideProps, NextPage } from "next";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { getSession, useSession } from "next-auth/react";

const PaperCreate: NextPage = () => {
  const { data: session } = useSession();  
  const [state, setState] = useState<{name: string; birthDate: string;}>({name: '', birthDate: ''});

  useEffect(() => {
    if (!session) Router.push('/login');
  }, []);

  const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setState(state => ({...state, [ev.target.name]: ev.target.value}));
  }

  // 롤링 페이퍼 생성
  const onPaperSubmit = async (ev: MouseEvent) => {
    ev.preventDefault();
    if (!state.name.length || !state.birthDate.length) return;
    try {
      const {data: {data}} = await axios.put('/api/paper', {
        name: state.name,
        birthDate: state.birthDate
      });
      Router.push(`/paper/${data.uid}`);
    } catch (err: any) {
      throw Error(err)
    }
  }

  return <Layout>
    <div className="w-full lg:w-10/12 mx-auto">
      <p className="text-xl">내 친구 롤링페이퍼 만들기</p>
      <form className="grid grid-cols-1 gap-4">
        <input type="text" name="name" id="name" maxLength={4} 
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="친구 이름" 
          value={state.name}
          onChange={changeHandler}
        />
        <input type="text" name="birthDate" id="birthDate" maxLength={4} 
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="친구 생일 (ex: 0605)" 
          value={state.birthDate}
          onChange={changeHandler}
        />
        <button
          onClick={onPaperSubmit}
          className="py-3 px-6 text-center text-white bg-yellow-500 rounded-md shadow-md"
        >만들기</button>
      </form> 
    </div>
  </Layout>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await getSession(context)
    }
  }
}

export default PaperCreate;