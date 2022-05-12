import Layout from "@/components/Layout";
import axios from "axios";
import Router from 'next/router';
import { GetServerSideProps, NextPage } from "next";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { z } from "zod";

const Paper = z.object({
  name: z.string(),
  birthDate: z.date(),
});

const PaperCreate: NextPage = () => {
  const { data: session, status } = useSession();  
  const [isValid, setIsValid] = useState({state: false, message: ''});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') Router.push('/login');
  }, []);

  // 롤링 페이퍼 생성
  const onPaperSubmit = async (ev: MouseEvent) => {
    ev.preventDefault();
    try {
      const form = formRef?.current as HTMLFormElement;
      const nameVal = form.friendName.value;
      const birthDateVal = new Date(`${form.year.value}-${form.month.value}-${form.day.value}`);
      const paperData = {
        name: nameVal,
        birthDate: birthDateVal,
      };
      const validation = Paper.safeParse(paperData);
      if (!validation.success) return setIsValid({state: true, message: '올바르지 않는 입력입니다'});
      const {data: {data}} = await axios.put('/api/paper', paperData);
      setIsValid({state: false, message: ''});
      Router.push(`/paper/${data.uid}`);
    } catch (err: any) {
      throw Error(err)
    }
  
  }

  return <Layout>
    <div className="w-full lg:w-10/12 mx-auto">
      <p className="text-xl">내 친구 롤링페이퍼 만들기</p>
      <form className="grid grid-cols-1 gap-4" ref={formRef}>
        <div>
          <label id="name" className="block text-sm font-medium text-gray-700"> 친구 이름 </label>
          <input type="text" name="friendName" id="friendName" maxLength={4} 
            className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
            placeholder="친구 이름" 
          />
        </div>
        <div className="flex justify-center items-center">
          <div className="flex-1">
            <label id="year" className="block text-sm font-medium text-gray-700">Year</label>
            <input type="number" name="year" id="year" max={new Date().getFullYear()}
              className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
              placeholder="YYYY"
            />
          </div>
          <div className="flex-1 pl-3">
            <label id="month" className="block text-sm font-medium text-gray-700">Month</label>
            <input type="number" name="month" id="month" max={12}
              className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
              placeholder="MM"
            />
          </div>
          <div className="flex-1 pl-3">
            <label id="day" className="block text-sm font-medium text-gray-700">Day</label>
            <input type="number" name="day" id="day" max={31}
              className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
              placeholder="DD"
            />
          </div>
        </div>
        {isValid && <div className="text-sm text-red-700">{isValid.message}</div>}
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