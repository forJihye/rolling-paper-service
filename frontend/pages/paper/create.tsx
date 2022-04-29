import Layout from "@/components/layout";
import { NextPage } from "next";
import { MouseEvent, useRef } from "react";

const PaperCreate: NextPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const birthRef = useRef<HTMLInputElement>(null);

  const onPaperSubmit = (ev: MouseEvent) => {
    ev.preventDefault();
    const nameVal = nameRef.current?.value as string;
    const birthVal = birthRef.current?.value as string;
    if (!nameVal.length || !birthVal.length) return window.alert('잘못된 입력');
    
    fetch('/api/paper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        friendName: nameVal,
        friendBirth: birthVal
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
  }

  return <Layout>
    <div className="w-11/12 md:w-6/12 lg:w-4/12 mx-auto">
      <form action="/api/paper" method="POST" className="grid grid-cols-1 gap-4">
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