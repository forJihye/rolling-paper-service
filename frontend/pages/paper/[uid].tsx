import { GetServerSideProps, NextPage } from "next"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Layout from "@/components/layout";
import LocalStorage from "helper/ls";

// http://localhost:3000/paper/b41f1b83-945f-4d97-a957-34d233b8ac50
const ls = new LocalStorage()
const PaperMain: NextPage<{paper: PaperData;}> = ({paper}) => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [postKey, setPostKey] = useState<number|null>(); 
  const [targetPost, setTargetPost] = useState<PostData[]>([]);
  const [btnText, setBtnText] = useState<string>('');

  useEffect(() => {
    const getPostKey = Number(ls.getItem(`${router.query.uid}`));
    const targetPost = paper.posts.filter(({key}) => key === getPostKey);
    setPostKey(getPostKey ? getPostKey : null);
    setTargetPost(targetPost);
    setBtnText(!targetPost.length ? '메시지 등록' : '메시지 수정');
    if (targetPost.length) {
      setName(targetPost[0].name);
      setMessage(targetPost[0].message);
    }
  }, []);

  const onInputChange = (type: string) => (ev: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    if (type === 'name') setName(ev.target.value);
    else setMessage(ev.target.value);
  }

  const onPostSubmit = async (ev: MouseEvent) => { // 롤링페이퍼 메시지 등록
    ev.preventDefault();
    try {
      const key = Date.now();
      if (postKey === null) {
        ls.setItem(`${router.query.uid}`, `${key}`);
        setPostKey(Number(key));
      }
      await axios.post(`/api/paper/${router.query.uid}`, {
        key: !postKey ? key : Number(ls.getItem(`${router.query.uid}`)),
        name,
        message
      });
      router.push(`/`);
      return false;
    } catch (e: any) {
      throw Error(e)
    }
  }

  const postFormRender = (postKey: number|null, targetPost: PostData[]) => {
    // console.log(messageKey, targetMessage, paper)
    if (!postKey) {
      return <form className="grid grid-cols-1 gap-4">
        <input type="text" name="name" id="name" maxLength={4} 
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="내 이름" 
          value={name}
          onChange={onInputChange('name')}
        />
        <textarea name="message" id="message" rows={15}
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="메시지" 
          value={message}
          onChange={onInputChange('message')}
        />
        <button
          onClick={onPostSubmit}
          className="py-3 px-6 text-center text-white bg-yellow-500 rounded-md shadow-md"
        >{btnText}</button>
      </form> 
    }
    if (postKey && targetPost.length) {
      return <form className="grid grid-cols-1 gap-4">
        <input type="text" name="name" id="name" maxLength={4} 
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="내 이름" 
          value={name}
          onChange={onInputChange('name')}
        />
        <textarea name="message" id="message" rows={15}
          className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
          placeholder="메시지" 
          value={message}
          onChange={onInputChange('message')}
        />
        <button
          onClick={onPostSubmit}
          className="py-3 px-6 text-center text-white bg-yellow-500 rounded-md shadow-md"
        >{btnText}</button>
      </form> 
    }
  }

  return <Layout>
    <div className="w-full lg:w-10/12 mx-auto">
      {!paper.isCompleted ? <div>{postFormRender(postKey as (number|null), targetPost)}</div> : <div>
        <Link href={`/complete/${paper.completedUid}`}>
          <a>완성 된 롤링페이퍼 보기</a>
        </Link>
      </div>}
      <div>만든 사람: {paper.userName}</div>
    </div>
  </Layout>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/paper/${context.query.uid}`);
    const data: {paper: PaperData} = await res.json();
    return {
      props: {
        paper: data.paper
      }
    }
  } catch (e) {
    return {
      props: {
        paper: []
      }
    }
  }
}

export default PaperMain;

{/* {!messageKey
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
              className="py-3 px-6 text-center text-white bg-yellow-500 rounded-md shadow-md"
            >메시지 남기기</button>
          </form> 
        : <div>none</div> */}
        // : !targetMessage.length ? <div>hihi</div> 
        // : <form className="grid grid-cols-1 gap-4">
        //     <input type="text" name="name" id="name" maxLength={4} 
        //       className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
        //       placeholder="내 이름" 
        //       ref={nameRef}
        //       defaultValue={targetMessage[0].name}
        //     />
        //     <textarea name="message" id="message" rows={15}
        //       className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
        //       placeholder="메시지" 
        //       ref={contentRef}
        //       defaultValue={targetMessage[0].message}
        //     />
        //     <button
        //       className="py-3 px-6 text-center text-white bg-yellow-500 rounded-md shadow-md"
        //     >메시지 수정하기</button>
        //   </form> 
      // }
      
