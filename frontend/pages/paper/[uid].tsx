import Layout from "@/components/layout";
import axios from "axios";
import { NextPage } from "next"
import { useRouter } from "next/router";
import { MouseEvent, useRef } from "react";

// http://localhost:3000/paper/1f4173c1-a7ff-45cf-a70b-437284ac8198
const PaperMain: NextPage<{}> = () => {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const onPostSubmit = async (ev: MouseEvent) => {
    ev.preventDefault();
    await axios.post(`/api/paper/${router.query.uid}/post`, {
      name: nameRef.current?.value,
      message: contentRef.current?.value
    });
    router.push(`/paper`);
    return false;
  }

  return <Layout>
    <div className="w-full lg:w-10/12 mx-auto">
      <form className="grid grid-cols-1 gap-4">
        <input type="text" name="name" id="name" maxLength={4} 
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="내 이름" 
          ref={nameRef}
          defaultValue="홍길순"
        />
        <textarea name="message" id="message"
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="메시지" 
          ref={contentRef}
          defaultValue="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        />
        <button
          onClick={onPostSubmit}
          className="py-3 px-6 text-center text-white bg-yellow-500 rounded-md shadow-md"
        >메시지 남기기</button>
      </form> 
    </div>
  </Layout>
}

export default PaperMain;