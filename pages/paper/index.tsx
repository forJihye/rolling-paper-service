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
  const handlerPaperSubmit = async (ev: MouseEvent) => {
    ev.preventDefault();
    try {
      const form = formRef?.current as HTMLFormElement;
      // const yearVal = form.year.value;
      const yearVal = new Date().getFullYear();
      const nameVal = form.friendName.value;
      const monthVal = form.month.value;
      const dateVal = form.date.value;
      if (!nameVal.length ||!monthVal.length || !dateVal.length) {
        return setIsValid({state: true, message: '친구 이름과 생년월일을 적어주세요😭'});
      }
      const birthDate = new Date(`${yearVal}-${monthVal}-${dateVal}`);
      const paperData = {
        name: nameVal,
        year: Number(yearVal),
        birthDate: birthDate,
      };
      const validation = Paper.safeParse(paperData);
      if (!validation.success) return setIsValid({state: true, message: '세상에 존재하지 않는 생년월일이에요 😭'});
      if (birthDate.getTime() < new Date().getTime()) return setIsValid({state: true, message: '이미 생일이 지났어요 😭'});
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
    <div className="w-full px-6 py-10">
      <div className="text-2xl text-gray-500 text-center tracking-tight mb-10">내 친구 <span className="text-pink">롤링페이퍼</span> 만들기</div>
      <form className="grid grid-cols-1 gap-4" ref={formRef}>
        <div>
          <input type="text" name="friendName" id="friendName" maxLength={4} minLength={2}
            className="block w-full py-4 px-6 bg-neumorphism shadow-inset rounded-full outline-none text-gray-500" placeholder="친구 이름" />
        </div>
        <div className="flex justify-center items-center">
          {/* <div className="flex-1">
            <input type="text" name="year" id="year" maxLength={4}
              className="block w-full py-4 px-6 bg-neumorphism shadow-inset rounded-full outline-none text-gray-500" placeholder="YYYY"
            />
          </div> */}
          <div className="flex-1">
            <select name="month" id="month" className="block w-full py-4 px-6 bg-neumorphism shadow-inset rounded-full outline-none text-gray-500">
              {months.map((val, i) => <option key={`month-${i}`} value={val}>{val} 월</option> )}
            </select>
          </div>
          <div className="flex-1 pl-3">
            <select name="date" id="date" className="block w-full py-4 px-6 bg-neumorphism shadow-inset rounded-full outline-none text-gray-500">
              {dates.map((val, i) => <option key={`date-${i}`} value={val}>{val} 일</option> )}
            </select>
          </div>
        </div>
        {!isValid.state ? null : <div className="text-gray-500 text-base text-center py-4">{isValid.message}</div>}
        <button onClick={handlerPaperSubmit} className="block w-full py-5 px-12 mx-auto text-center rounded-full text-gray-500 neumorphism hover:shadow-inset hover:text-pink">만들기</button>
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