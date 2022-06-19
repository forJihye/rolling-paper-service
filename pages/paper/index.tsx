import Layout from "@/components/Layout";
import Router from 'next/router';
import { GetServerSideProps, NextPage } from "next";
import { MouseEvent, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import { z } from "zod";
import ky from "ky";

const Paper = z.object({
  name: z.string(),
  year: z.number().gte(1919).lte(new Date().getFullYear() + 1),
  birthDate: z.date(),
});

const months = Array.from({length: 12}, (_, i) => {
  const v = i + 1
  return v < 10 ? `0${v}` : v;
});
const dates = Array.from({length: 31}, (_, i) => {
  const v = i + 1
  return v < 10 ? `0${v}` : v;
});

const PaperCreate: NextPage = () => {
  const [isValid, setIsValid] = useState({state: false, message: ''});
  const formRef = useRef<HTMLFormElement>(null);

  // 롤링 페이퍼 생성
  const onPaperSubmit = async (ev: MouseEvent) => {
    ev.preventDefault();
    try {
      const form = formRef?.current as HTMLFormElement;
      const nameVal = form.friendName.value;
      const yearVal = form.year.value;
      const monthVal = form.month.value;
      const dateVal = form.date.value;
      if (!nameVal.length || !yearVal.length || !monthVal.length || !dateVal.length) return;
      const paperData = {
        name: nameVal,
        year: Number(yearVal),
        birthDate: new Date(`${yearVal}-${monthVal}-${dateVal}`),
      };
      const validation = Paper.safeParse(paperData);
      if (!validation.success) return setIsValid({state: true, message: '잘못된 날짜입니다.'});
      const response = await ky.put('/api/paper', {
        json: {
          name: paperData.name,
          birthDate: paperData.birthDate
        }
      });
      const data = await response.json() as StorePaperData;
      setIsValid({state: false, message: ''});
      Router.push(`/paper/${data.uid}`);
    } catch (err: any) {
      console.log(err)
      throw Error(err)
    }
  }

  return <Layout>
    <div className="w-full lg:w-10/12 mx-auto">
      <p className="text-xl">내 친구 롤링페이퍼 만들기</p>
      <form className="grid grid-cols-1 gap-4" ref={formRef}>
        <div>
          <label id="name" className="block text-sm font-medium text-gray-700"> 친구 이름 </label>
          <input type="text" name="friendName" id="friendName" maxLength={4} minLength={2}
            className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
            placeholder="친구 이름" 
          />
        </div>
        <div className="flex justify-center items-center">
          <div className="flex-1">
            <label id="year" className="block text-sm font-medium text-gray-700">Year</label>
            <input type="text" name="year" id="year" maxLength={4}
              className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
              placeholder="YYYY"
            />
          </div>
          <div className="flex-1 pl-3">
            <label id="month" className="block text-sm font-medium text-gray-700">Month</label>
            <select name="month" id="month" className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none">
              {months.map((val, i) => 
                <option key={`month-${i}`} value={val}>{val}</option>
              )}
            </select>
          </div>
          <div className="flex-1 pl-3">
            <label id="date" className="block text-sm font-medium text-gray-700">Date</label>
            <select name="date" id="date" className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none">
              {dates.map((val, i) => 
                <option key={`date-${i}`} value={val}>{val}</option>
              )}
            </select>
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
    return {
      props: { session } 
    }
  }
}

export default PaperCreate;