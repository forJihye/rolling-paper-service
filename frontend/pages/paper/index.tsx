import Layout from "@/components/layout";
import axios from "axios";
import Router from 'next/router';
import { GetServerSideProps, NextPage } from "next";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";

const PaperCreate: NextPage = () => {
  const { data: session } = useSession();  
  const [state, setState] = useState<{name: string; year: string; month: string; day: string}>({name: '', year: '', month: '', day: ''});
  
  useEffect(() => {
    if (!session) Router.push('/login');
  }, []);

  // Input
  const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setState(state => ({...state, [ev.target.name]: ev.target.value}));
  }

  // 롤링 페이퍼 생성
  const onPaperSubmit = async (ev: MouseEvent) => {
    ev.preventDefault();
    if (!state.name.length || !state.year.length || !state.month.length || !state.day.length) return;
    try {
      const {data: {data}} = await axios.put('/api/paper', {
        name: state.name,
        birthDate: new Date(`${state.year}-${state.month}-${state.day}`)
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
        <div>
          <label id="name" className="block text-sm font-medium text-gray-700"> 친구 이름 </label>
          <input type="text" name="name" id="name" maxLength={4} 
            className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
            placeholder="친구 이름" 
            value={state.name}
            onChange={changeHandler}
          />
        </div>
        <div className="flex justify-center items-center">
          <div className="flex-1">
            <label id="year" className="block text-sm font-medium text-gray-700">Year</label>
            <input type="number" name="year" id="year" maxLength={4}
              className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
              placeholder="YYYY"
              value={state.year}
              onChange={changeHandler}
            />
          </div>
          <div className="flex-1 pl-3">
            <label id="month" className="block text-sm font-medium text-gray-700">Month</label>
            <input type="number" name="month" id="month" maxLength={2} 
              className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
              placeholder="MM"
              value={state.month}
              onChange={changeHandler}
            />
          </div>
          <div className="flex-1 pl-3">
            <label id="day" className="block text-sm font-medium text-gray-700">Day</label>
            <input type="number" name="day" id="day" maxLength={2} 
              className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
              placeholder="DD"
              value={state.day}
              onChange={changeHandler}
            />
          </div>
        </div>
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