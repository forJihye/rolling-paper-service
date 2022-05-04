import Layout from "@/components/layout";
import axios from "axios";
import { fetcher } from "lib/fetcher";
import { NextPage } from "next"
import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent, useRef } from "react";
import useSWR from "swr";

// http://localhost:3000/paper/c7768bb7-b187-4315-b6b3-5c228f421fd3
const PaperMain: NextPage<{}> = () => {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const {data, error} = useSWR<{paper: PaperData}>(`/api/paper/${router.query.uid}`, fetcher);
  
  const onPostSubmit = async (ev: MouseEvent) => { // 롤링페이퍼 메시지 등록
    ev.preventDefault();
    await axios.post(`/api/paper/${router.query.uid}/post`, {
      name: nameRef.current?.value,
      message: contentRef.current?.value
    });
    router.push(`/`);
    return false;
  }

  if (error) return <Layout>401</Layout>
  if (!data) return <Layout>loading...</Layout>
  return <Layout>
    <div className="w-full lg:w-10/12 mx-auto">
      {!data.paper.isCompleted 
      ? <form className="grid grid-cols-1 gap-4">
          <input type="text" name="name" id="name" maxLength={4} 
            className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
            placeholder="내 이름" 
            ref={nameRef}
            defaultValue="홍길순"
          />
          <textarea name="message" id="message" rows={15}
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
      : <div>
        <Link href={`/complete/${data.paper.completedUid}`}>
          <a>완성 된 롤링페이퍼 보기</a>
        </Link>
      </div>
      }
    </div>
  </Layout>
}

export default PaperMain;